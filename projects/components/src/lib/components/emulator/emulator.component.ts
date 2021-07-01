// Angular modules
import { Component }         from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { OnDestroy }         from '@angular/core';
import { Input }             from '@angular/core';
import { ElementRef }        from '@angular/core';
import { OnInit }            from '@angular/core';
import { Renderer2 }         from '@angular/core';

// External modules
import { unzip }             from 'unzipit';
import { Subscription }      from 'rxjs';

// Helpers
import { EmitterHelper }     from '../../helpers/emitter.helper';

// Models
import { GameControls }      from '../../models/key-binding.model';

declare const FS : any;
declare const Browser : any;
window['Module'] = {
  canvas       : null,
  noInitialRun : true,
  arguments    : ['/rom.bin', '--verbose'],
  onRuntimeInitialized: function() {
    EmitterHelper.sendWasmReady();
  },
  // print    : function(text) {},
  // printErr : function(text) {}
};

@Component({
  selector    : 'ngx-retroarch',
  templateUrl : './emulator.component.html',
  styleUrls   : ['./emulator.component.scss']
})
export class EmulatorComponent implements OnInit, OnDestroy
{
  // NOTE Inherited properties
  @Input() assetPath  : string = './';
  @Input() romPath    : string = './';
  @Input() core       : string = null;
  @Input() rom        : string = null;

  // NOTE States
  public  romReady       : boolean = false;
  public  wasmReady      : boolean = false;
  public  bundleReady    : boolean = false;
  public  gameStarted    : boolean = false;
  private wasmReadySub   : Subscription;

  // NOTE Data
  private canvas  : HTMLElement = null;
  private romName : string      = null;
  private romData : Uint8Array  = null;

  // NOTE User data
  private gameControls : GameControls = null;

  // NOTE Core config
  private nulKeys         : string   = 'input_ai_service = "nul"\ninput_ai_service_axis = "nul"\ninput_ai_service_btn = "nul"\ninput_ai_service_mbtn = "nul"\ninput_audio_mute = "nul"\ninput_audio_mute_axis = "nul"\ninput_audio_mute_btn = "nul"\ninput_audio_mute_mbtn = "nul"\ninput_cheat_index_minus = "nul"\ninput_cheat_index_minus_axis = "nul"\ninput_cheat_index_minus_btn = "nul"\ninput_cheat_index_minus_mbtn = "nul"\ninput_cheat_index_plus = "nul"\ninput_cheat_index_plus_axis = "nul"\ninput_cheat_index_plus_btn = "nul"\ninput_cheat_index_plus_mbtn = "nul"\ninput_cheat_toggle = "nul"\ninput_cheat_toggle_axis = "nul"\ninput_cheat_toggle_btn = "nul"\ninput_cheat_toggle_mbtn = "nul"\ninput_desktop_menu_toggle = "nul"\ninput_desktop_menu_toggle_axis = "nul"\ninput_desktop_menu_toggle_btn = "nul"\ninput_desktop_menu_toggle_mbtn = "nul"\ninput_disk_eject_toggle = "nul"\ninput_disk_eject_toggle_axis = "nul"\ninput_disk_eject_toggle_btn = "nul"\ninput_disk_eject_toggle_mbtn = "nul"\ninput_disk_next = "nul"\ninput_disk_next_axis = "nul"\ninput_disk_next_btn = "nul"\ninput_disk_next_mbtn = "nul"\ninput_disk_prev = "nul"\ninput_disk_prev_axis = "nul"\ninput_disk_prev_btn = "nul"\ninput_disk_prev_mbtn = "nul"\ninput_duty_cycle = "nul"\ninput_enable_hotkey = "nul"\ninput_enable_hotkey_axis = "nul"\ninput_enable_hotkey_btn = "nul"\ninput_enable_hotkey_mbtn = "nul"\ninput_exit_emulator = "nul"\ninput_exit_emulator_axis = "nul"\ninput_exit_emulator_btn = "nul"\ninput_exit_emulator_mbtn = "nul"\ninput_fps_toggle = "nul"\ninput_fps_toggle_axis = "nul"\ninput_fps_toggle_btn = "nul"\ninput_fps_toggle_mbtn = "nul"\ninput_frame_advance = "nul"\ninput_frame_advance_axis = "nul"\ninput_frame_advance_btn = "nul"\ninput_frame_advance_mbtn = "nul"\ninput_game_focus_toggle = "nul"\ninput_game_focus_toggle_axis = "nul"\ninput_game_focus_toggle_btn = "nul"\ninput_game_focus_toggle_mbtn = "nul"\ninput_grab_mouse_toggle = "nul"\ninput_grab_mouse_toggle_axis = "nul"\ninput_grab_mouse_toggle_btn = "nul"\ninput_grab_mouse_toggle_mbtn = "nul"\ninput_hold_fast_forward = "nul"\ninput_hold_fast_forward_axis = "nul"\ninput_hold_fast_forward_btn = "nul"\ninput_hold_fast_forward_mbtn = "nul"\ninput_hold_slowmotion = "nul"\ninput_slowmotion = "nul"\ninput_hold_slowmotion_axis = "nul"\ninput_hold_slowmotion_btn = "nul"\ninput_hold_slowmotion_mbtn = "nul"\ninput_hotkey_block_delay = "nul"\ninput_load_state_axis = "nul"\ninput_load_state_btn = "nul"\ninput_load_state_mbtn = "nul"\ninput_menu_toggle_axis = "nul"\ninput_menu_toggle_btn = "nul"\ninput_menu_toggle_mbtn = "nul"\ninput_movie_record_toggle = "nul"\ninput_movie_record_toggle_axis = "nul"\ninput_movie_record_toggle_btn = "nul"\ninput_movie_record_toggle_mbtn = "nul"\ninput_netplay_game_watch = "nul"\ninput_netplay_game_watch_axis = "nul"\ninput_netplay_game_watch_btn = "nul"\ninput_netplay_game_watch_mbtn = "nul"\ninput_netplay_host_toggle = "nul"\ninput_netplay_host_toggle_axis = "nul"\ninput_netplay_host_toggle_btn = "nul"\ninput_netplay_host_toggle_mbtn = "nul"\ninput_osk_toggle = "nul"\ninput_osk_toggle_axis = "nul"\ninput_osk_toggle_btn = "nul"\ninput_osk_toggle_mbtn = "nul"\ninput_overlay_next = "nul"\ninput_overlay_next_axis = "nul"\ninput_overlay_next_btn = "nul"\ninput_overlay_next_mbtn = "nul"\ninput_pause_toggle = "nul"\ninput_pause_toggle_axis = "nul"\ninput_pause_toggle_btn = "nul"\ninput_pause_toggle_mbtn = "nul"\ninput_player1_a_axis = "nul"\ninput_player1_a_btn = "nul"\ninput_player1_a_mbtn = "nul"\ninput_player1_b_axis = "nul"\ninput_player1_b_btn = "nul"\ninput_player1_b_mbtn = "nul"\ninput_player1_down_axis = "nul"\ninput_player1_down_btn = "nul"\ninput_player1_down_mbtn = "nul"\ninput_player1_gun_aux_a = "nul"\ninput_player1_gun_aux_a_axis = "nul"\ninput_player1_gun_aux_a_btn = "nul"\ninput_player1_gun_aux_a_mbtn = "nul"\ninput_player1_gun_aux_b = "nul"\ninput_player1_gun_aux_b_axis = "nul"\ninput_player1_gun_aux_b_btn = "nul"\ninput_player1_gun_aux_b_mbtn = "nul"\ninput_player1_gun_aux_c = "nul"\ninput_player1_gun_aux_c_axis = "nul"\ninput_player1_gun_aux_c_btn = "nul"\ninput_player1_gun_aux_c_mbtn = "nul"\ninput_player1_gun_dpad_down = "nul"\ninput_player1_gun_dpad_down_axis = "nul"\ninput_player1_gun_dpad_down_btn = "nul"\ninput_player1_gun_dpad_down_mbtn = "nul"\ninput_player1_gun_dpad_left = "nul"\ninput_player1_gun_dpad_left_axis = "nul"\ninput_player1_gun_dpad_left_btn = "nul"\ninput_player1_gun_dpad_left_mbtn = "nul"\ninput_player1_gun_dpad_right = "nul"\ninput_player1_gun_dpad_right_axis = "nul"\ninput_player1_gun_dpad_right_btn = "nul"\ninput_player1_gun_dpad_right_mbtn = "nul"\ninput_player1_gun_dpad_up = "nul"\ninput_player1_gun_dpad_up_axis = "nul"\ninput_player1_gun_dpad_up_btn = "nul"\ninput_player1_gun_dpad_up_mbtn = "nul"\ninput_player1_gun_offscreen_shot = "nul"\ninput_player1_gun_offscreen_shot_axis = "nul"\ninput_player1_gun_offscreen_shot_btn = "nul"\ninput_player1_gun_offscreen_shot_mbtn = "nul"\ninput_player1_gun_select = "nul"\ninput_player1_gun_select_axis = "nul"\ninput_player1_gun_select_btn = "nul"\ninput_player1_gun_select_mbtn = "nul"\ninput_player1_gun_start = "nul"\ninput_player1_gun_start_axis = "nul"\ninput_player1_gun_start_btn = "nul"\ninput_player1_gun_start_mbtn = "nul"\ninput_player1_gun_trigger = "nul"\ninput_player1_gun_trigger_axis = "nul"\ninput_player1_gun_trigger_btn = "nul"\ninput_player1_gun_trigger_mbtn = "nul"\ninput_player1_l2_axis = "nul"\ninput_player1_l2_btn = "nul"\ninput_player1_l2_mbtn = "nul"\ninput_player1_l3 = "nul"\ninput_player1_l3_axis = "nul"\ninput_player1_l3_mbtn = "nul"\ninput_player1_l_axis = "nul"\ninput_player1_l_btn = "nul"\ninput_player1_l_mbtn = "nul"\ninput_player1_l_x_minus_axis = "nul"\ninput_player1_l_x_minus_btn = "nul"\ninput_player1_l_x_minus_mbtn = "nul"\ninput_player1_l_x_plus_axis = "nul"\ninput_player1_l_x_plus_btn = "nul"\ninput_player1_l_x_plus_mbtn = "nul"\ninput_player1_l_y_minus_axis = "nul"\ninput_player1_l_y_minus_btn = "nul"\ninput_player1_l_y_minus_mbtn = "nul"\ninput_player1_l_y_plus_axis = "nul"\ninput_player1_l_y_plus_btn = "nul"\ninput_player1_l_y_plus_mbtn = "nul"\ninput_player1_left_axis = "nul"\ninput_player1_left_mbtn = "nul"\ninput_player1_r2_axis = "nul"\ninput_player1_r2_btn = "nul"\ninput_player1_r2_mbtn = "nul"\ninput_player1_r3 = "nul"\ninput_player1_r3_axis = "nul"\ninput_player1_r3_mbtn = "nul"\ninput_player1_r_axis = "nul"\ninput_player1_r_btn = "nul"\ninput_player1_r_mbtn = "nul"\ninput_player1_r_x_minus_axis = "nul"\ninput_player1_r_x_minus_btn = "nul"\ninput_player1_r_x_minus_mbtn = "nul"\ninput_player1_r_x_plus_axis = "nul"\ninput_player1_r_x_plus_btn = "nul"\ninput_player1_r_x_plus_mbtn = "nul"\ninput_player1_r_y_minus_axis = "nul"\ninput_player1_r_y_minus_btn = "nul"\ninput_player1_r_y_minus_mbtn = "nul"\ninput_player1_r_y_plus_axis = "nul"\ninput_player1_r_y_plus_btn = "nul"\ninput_player1_r_y_plus_mbtn = "nul"\ninput_player1_right_axis = "nul"\ninput_player1_right_mbtn = "nul"\ninput_player1_select_axis = "nul"\ninput_player1_select_btn = "nul"\ninput_player1_select_mbtn = "nul"\ninput_player1_start_axis = "nul"\ninput_player1_start_btn = "nul"\ninput_player1_start_mbtn = "nul"\ninput_player1_turbo = "nul"\ninput_player1_turbo_axis = "nul"\ninput_player1_turbo_btn = "nul"\ninput_player1_turbo_mbtn = "nul"\ninput_player1_up_axis = "nul"\ninput_player1_up_btn = "nul"\ninput_player1_up_mbtn = "nul"\ninput_player1_x_axis = "nul"\ninput_player1_x_btn = "nul"\ninput_player1_x_mbtn = "nul"\ninput_player1_y_axis = "nul"\ninput_player1_y_btn = "nul"\ninput_player1_y_mbtn = "nul"\ninput_poll_type_behavior = "nul"\ninput_recording_toggle = "nul"\ninput_recording_toggle_axis = "nul"\ninput_recording_toggle_btn = "nul"\ninput_recording_toggle_mbtn = "nul"\ninput_reset = "nul"\ninput_reset_axis = "nul"\ninput_reset_btn = "nul"\ninput_reset_mbtn = "nul"\ninput_rewind = "nul"\ninput_rewind_axis = "nul"\ninput_rewind_btn = "nul"\ninput_rewind_mbtn = "nul"\ninput_save_state_axis = "nul"\ninput_save_state_btn = "nul"\ninput_save_state_mbtn = "nul"\ninput_screenshot = "nul"\ninput_screenshot_axis = "nul"\ninput_screenshot_btn = "nul"\ninput_screenshot_mbtn = "nul"\ninput_send_debug_info = "nul"\ninput_send_debug_info_axis = "nul"\ninput_send_debug_info_btn = "nul"\ninput_send_debug_info_mbtn = "nul"\ninput_shader_next = "nul"\ninput_shader_next_axis = "nul"\ninput_shader_next_btn = "nul"\ninput_shader_next_mbtn = "nul"\ninput_shader_prev = "nul"\ninput_shader_prev_axis = "nul"\ninput_shader_prev_btn = "nul"\ninput_shader_prev_mbtn = "nul"\ninput_state_slot_decrease = "nul"\ninput_state_slot_decrease_axis = "nul"\ninput_state_slot_decrease_btn = "nul"\ninput_state_slot_decrease_mbtn = "nul"\ninput_state_slot_increase = "nul"\ninput_state_slot_increase_axis = "nul"\ninput_state_slot_increase_btn = "nul"\ninput_state_slot_increase_mbtn = "nul"\ninput_streaming_toggle = "nul"\ninput_streaming_toggle_axis = "nul"\ninput_streaming_toggle_btn = "nul"\ninput_streaming_toggle_mbtn = "nul"\ninput_toggle_fast_forward = "nul"\ninput_toggle_fast_forward_axis = "nul"\ninput_toggle_fast_forward_btn = "nul"\ninput_toggle_fast_forward_mbtn = "nul"\ninput_toggle_fullscreen = "nul"\ninput_toggle_fullscreen_axis = "nul"\ninput_toggle_fullscreen_btn = "nul"\ninput_toggle_fullscreen_mbtn = "nul"\ninput_toggle_slowmotion = "nul"\ninput_toggle_slowmotion_axis = "nul"\ninput_toggle_slowmotion_btn = "nul"\ninput_toggle_slowmotion_mbtn = "nul"\ninput_turbo_default_button = "nul"\ninput_turbo_mode = "nul"\ninput_turbo_period = "nul"\ninput_volume_down = "nul"\ninput_volume_down_axis = "nul"\ninput_volume_down_btn = "nul"\ninput_volume_down_mbtn = "nul"\ninput_volume_up = "nul"\ninput_volume_up_axis = "nul"\ninput_volume_up_btn = "nul"\ninput_volume_up_mbtn = "nul"\n';
  private extraConfig     : string   = 'rgui_show_start_screen = "true"\n';
  private baseFsBundleDir : string   = '/home/web_user/retroarch/bundle';
  private installedCores  : string[] = ['genesis_plus_gx', 'mgba', 'mupen64plus_next', 'nestopia', 'snes9x'];
  private systems = {
    'beetle_psx'       : 'PS1',
    'citra'            : 'Nintendo 3DS',
    'desmume'          : 'Nintendo DS',
    'dolphin'          : 'GC/Wii',
    'genesis_plus_gx'  : 'Genesis',
    'mgba'             : 'GBA',
    'mupen64plus_next' : 'Nintendo 64',
    'nestopia'         : 'NES',
    'parallel_n64'     : 'Nintendo 64',
    'ppsspp'           : 'PSP',
    'snes9x'           : 'SNES',
  };
  private fileExts = {
    'GBA'          : [ 'gb', 'gbc', 'gba'],
    'GC/Wii'       : [ 'iso', 'gcm', 'dol', 'tgc', 'wbfs', 'ciso', 'gcz', 'wad' ],
    'Genesis'      : [ 'mdx', 'md', 'smd', 'gen', 'sms', 'gg', 'sg', '68k', 'chd' ],
    'NES'          : [ 'nes', 'fds', 'unf', 'unif' ],
    'Nintendo 64'  : [ 'n64', 'v64', 'z64', 'u1', 'ndd' ],
    'Nintendo 3DS' : [ '3ds', '3dsx', 'cci', 'cxi' ],
    'Nintendo DS'  : [ 'nds', 'srl' ],
    'PS1'          : [ 'ccd', 'iso' ],
    'PSP'          : [ 'cso', 'pbp' ],
    'SNES'         : [ 'smc', 'sfc', 'swc', 'fig', 'bs', 'st' ],
  };

  constructor
  (
    private readonly elementRef : ElementRef,
    private changeDetectorRef   : ChangeDetectorRef,
    private          renderer   : Renderer2
  )
  {
    this.wasmReadySub = this.wasmReadySubscription();
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Init ----------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public async ngOnInit() : Promise<void>
  {
    // NOTE Get canvas element
    this.canvas = document.getElementById('canvas');
    // NOTE Update Module.canvas
    window['Module'].canvas = this.canvas;

    // NOTE Load core
    if (!this.core)
      return;
    await this.loadCore();

    // NOTE Load ROM
    if (!this.rom)
      return;
    await this.loadRom();

    // NOTE Try to load asset bundle
    await this.loadAssetBundle();
  }

  public ngOnDestroy() : void
  {
    this.wasmReadySub.unsubscribe();
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Main ----------------------------------------------------------------
  // -------------------------------------------------------------------------------

  /** NOTE Step 1 */
  private loadCore() : Promise<void>
  {
    // NOTE Check core
    if (!this.installedCores.includes(this.core))
      throw new Error('EmulatorComponent : loadCore -> Could not load specified core "' + this.core + '". Here is a list of available cores [' + this.installedCores.join(', ') + ']');

    // NOTE Load core
    return new Promise((resolve, reject) =>
    {
      const script  = this.renderer.createElement('script');
      script.src    = this.assetPath + this.core + '_libretro.js';
      script.onload = () =>
      {
        console.log('1 - Core ready');
        return resolve();
      };
      this.renderer.appendChild(this.elementRef.nativeElement, script);
    });
  }

  /** NOTE Step 1.1 */
  private async loadRom() : Promise<void>
  {
    // NOTE Get ROM file
    const pathToRom = this.romPath + this.rom;
    let   blob      = await this.getFile(pathToRom, 'blob') as Blob | null;
    if (!blob)
      throw new Error('EmulatorComponent : loadRom -> Unable to fetch ROM at ' + pathToRom);

    // NOTE Get ROM extension
    const fileExt = this.rom.split('.').slice(-1)[0];

    // NOTE Unzip file
    if (fileExt === 'zip')
      blob = await this.unzipFile(blob);

    // NOTE Check ROM extension
    else if (!this.getAvailableExts().includes(fileExt))
      throw new Error('EmulatorComponent : loadRom -> Invalid ROM file for "' + this.core + '" core. Are you using the right core?');

    const arrayBuffer = await blob.arrayBuffer();

    this.romName  = this.rom.split('.')[0];
    this.romData  = new Uint8Array(arrayBuffer);
    this.romReady = true;
    this.changeDetectorRef.detectChanges();
    console.log('1.1 - ROM ready');
  }

  /** NOTE Step 2.1 : Not mandatory */
  private async loadAssetBundle() : Promise<void>
  {
    if (!this.romReady || !this.wasmReady || this.bundleReady)
    {
      const notReadyYet = !this.romReady ? 'ROM' : 'WASM';
      console.warn('Unable to load the asset bundle : ' + notReadyYet + ' is not ready yet!');
      return;
    }

    const fsBundleDirs = [['', 'assets'], ['/assets', 'menu_widgets'], ['/assets', 'ozone'], ['/assets/ozone', 'png'], ['/assets/ozone/png', 'dark'], ['/assets/ozone/png', 'sidebar'], ['/assets', 'xmb'], ['/assets/xmb', 'monochrome'], ['/assets/xmb/monochrome', 'png']];

    FS.createPath('/', 'home/web_user/retroarch/bundle', true, true);
    for (let i = 0; i < fsBundleDirs.length; i++)
      FS.createPath(this.baseFsBundleDir + fsBundleDirs[i][0], fsBundleDirs[i][1], true, true);

    // NOTE Get list of assets
    const fileName = 'indexedfiles.txt';
    const fileList = await this.getFile(this.assetPath + fileName, 'text') as string | null;
    if (!fileList)
    {
      console.log('2.1 - Assets ready');
      this.bundleReady = true;
      this.changeDetectorRef.detectChanges();
      return;
    }

    // NOTE Get & load assets
    const fsBundleFiles : string[] = fileList.split('\n');
    for (let y = 0; y < fsBundleFiles.length; y++)
    {
      const assetFile = await this.getFile(this.assetPath + fsBundleFiles[y].trim(), 'arrayBuffer') as ArrayBuffer | null;
      if (!assetFile)
        continue;
      FS.writeFile(this.baseFsBundleDir + fsBundleFiles[y].trim(), new Uint8Array(assetFile));
    }

    console.log('2.1 - Assets ready');
    this.bundleReady = true;
    this.changeDetectorRef.detectChanges();
  }

  /** NOTE Step 3 */
  public async initCore() : Promise<void>
  {
    if (!this.romReady || !this.bundleReady)
      return;

    // NOTE Rom
    FS.writeFile('/rom.bin', this.romData);

    // NOTE Config
    this.gameControls = new GameControls();
    FS.createPath('/', 'home/web_user/retroarch/userdata', true, true);
    FS.writeFile('/home/web_user/retroarch/userdata/retroarch.cfg', this.nulKeys + this.gameControls.asRetroarchConfig() + this.extraConfig);

    // NOTE Start
    window['Module'].callMain(window['Module'].arguments);
    this.gameStarted = true;

    console.log('3 - Game started');

    setTimeout(_ => {
      // Browser.mainLoop.pause(); // YES
      // Browser.requestFullscreen(true, false); // Maybe
      // Browser.exitFullscreen(); // Maybe
      // Browser.setFullscreenCanvasSize(); // NO
      // Browser.setWindowedCanvasSize(); // NO

      // TODO After writefile (update config) FS.syncfs()

      // try : FS.stat(path : string, follow : bool)
      // there is chmod chown + open close = like writeFile options (in 3rd parameter opts.flags 577, opt.mode, opt.canOwn)

    }, 5000);
  }

  public test() : void
  {
    // window['Module']['requestFullscreen'](true, false); // YES
    // window['Module']['pauseMainLoop'](); // YES
    // window['Module']['resumeMainLoop'](); // YES
    // _cmd_saveFiles()
    // _cmd_save_state()
    // _cmd_undo_save_state()
    // _cmd_load_state()
    // _cmd_undo_load_state()
    // _cmd_take_screenshot()

    this.gameControls['input_player1_a'] = 'a';
    this.gameControls['input_player1_l_x_minus'] = 'h';
    // NOTE https://retropie.org.uk/docs/RetroArch-Configuration/#core-input-remapping
    // https://user-images.githubusercontent.com/3280180/54955719-78771d80-4f24-11e9-9fca-a1a58c52dc8c.PNG
    // console.log('/home/web_user/retroarch/userdata/'+this.core+'/'+this.core+'.rmp');
    FS.writeFile('/home/web_user/retroarch/userdata/config/Snes9x/Snes9x.cfg', this.gameControls.asRetroarchConfig());
    // /home/web_user/retroarch/userdata/config/remaps/
    // "/home/web_user/retroarch/userdata/config/Snes9x/rom.cfg"
    // "/home/web_user/retroarch/userdata/config/Snes9x/.cfg"
    // "/home/web_user/retroarch/userdata/config/Snes9x/Snes9x.cfg"
    // FS.apply();
    // FS.syncfs(() => { });
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Helpers -------------------------------------------------------------
  // -------------------------------------------------------------------------------

  private getAvailableExts() : string[]
  {
    let systems  : string[] = Object.keys(this.systems);
    let consoles : string[] = Object.keys(this.fileExts);

    // NOTE Get console by core
    let console : string = null;
    if (systems.includes(this.core))
      console = this.systems[this.core];

    // NOTE Get extensions by console
    let exts : string[] = [];
    if (consoles.includes(console))
      exts = this.fileExts[console];

    return exts;
  }

  private async unzipFile(blob : Blob) : Promise<any>
  {
    const { entries } = await unzip(blob);
    const fileNames   = Object.keys(entries);

    // NOTE Empty zip
    if (!fileNames.length)
      throw new Error('EmulatorComponent : unzipFile -> That zip file appears to be empty!');

    // NOTE Check file extension
    const exts = this.getAvailableExts();
    let rom : string = null;
    for (let fileName of fileNames)
    {
      let fileExt = fileName.split('.').slice(-1)[0];
      if (exts.includes(fileExt))
        rom = fileName;
    }

    if (!rom)
      throw new Error('EmulatorComponent : unzipFile -> Couldn\'t find a valid ROM file for "' + this.core + '" core in that zip file. Are you using the right core?');

    return await entries[rom].blob();
  }

  private getFile(filePath : string, fileType : 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text') : Promise<ArrayBuffer | Blob | FormData | any | string | null>
  {
    return new Promise(resolve =>
    {
      fetch(filePath, { method : 'GET', }).then(response =>
      {
        if (response.ok)
          return resolve(response[fileType]());

        console.warn('EmulatorComponent : getFile -> Unable to fetch file at ' + filePath);
        return resolve(null);
      });
    });
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Subscription --------------------------------------------------------
  // -------------------------------------------------------------------------------

  private wasmReadySubscription() : Subscription
  {
    return EmitterHelper.emitWasmReady.subscribe(_ =>
    {
      console.log('2 - WASM ready');
      this.wasmReady = true;

      // NOTE Try to load asset bundle
      this.loadAssetBundle();
    });
  }
}
