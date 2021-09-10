// Angular modules
import { Component }            from '@angular/core';
import { ChangeDetectorRef }    from '@angular/core';
import { OnDestroy }            from '@angular/core';
import { Input }                from '@angular/core';
import { ElementRef }           from '@angular/core';
import { OnInit }               from '@angular/core';
import { Renderer2 }            from '@angular/core';

// External modules
import { unzip }                from 'unzipit';
import { Subscription }         from 'rxjs';
import { TranslateService }     from '@ngx-translate/core';

// Helpers
import { EmitterHelper }        from '../../helpers/emitter.helper';
import { StorageHelper }        from '../../helpers/storage.helper';
import { ForageHelper }         from '../../helpers/forage.helper';
import { ContainerQueryHelper } from '../../helpers/container-query.helper';

// Models
import { PlayerConfig }         from '../../models/player-config.model';
import { MainConfig }           from '../../models/main-config.model';

// Enums
import { FsPath }               from '../../enums/fs-path.enum';

// Types
import { Core }                 from '../../types/core.type';
import { Lang }                 from '../../types/lang.type';

// Consts
import { English }              from '../../consts/en';
import { French }               from '../../consts/fr';

// NOTE Retroarch variables
declare const JSEvents : any;
declare const FS : any;
window['Module'] = {
  canvas       : null,
  noInitialRun : true,
  arguments    : ['/rom.bin', '--verbose'],
  onRuntimeInitialized : function()
  {
    EmitterHelper.sendWasmReady();
  },
};

@Component({
  selector    : 'ngx-retroarch',
  templateUrl : './emulator.component.html',
  styleUrls   : ['./emulator.component.scss']
})
export class EmulatorComponent implements OnInit, OnDestroy
{
  // NOTE Inherited properties
  @Input() lang        : Lang    = 'en';
  @Input() assetPath   : string  = './';
  @Input() romPath     : string  = './';
  @Input() core        : Core    = null;
  @Input() rom         : string  = null;
  @Input() development : boolean = false;

  // NOTE Component properties
  public  canvas            : HTMLCanvasElement = null;
  public  isFocused         : boolean           = false;
  public  romReady          : boolean           = false;
  public  wasmReady         : boolean           = false;
  public  bundleReady       : boolean           = false;
  public  gameStarted       : boolean           = false;
  public  showControls      : boolean           = false;
  public  showStates        : boolean           = false;
  private wasmReadySub      : Subscription;
  private toggleStatesSub   : Subscription;
  private toggleControlsSub : Subscription;

  // NOTE Retroarch propertiers
  public  romName : string      = null;
  private romData : Uint8Array  = null;

  public  mainConfig   : MainConfig   = new MainConfig();
  public  playerConfig : PlayerConfig = null;

  private installedCores : Core[] = [
    // 'genesis_plus_gx',
    // 'mgba',
    // 'mupen64plus_next',
    // 'nestopia',
    'snes9x'
  ];
  private fileExts : { [key in Core] : string[]; } = {
    'mgba'             : [ 'gb', 'gbc', 'gba'],
    'dolphin'          : [ 'iso', 'gcm', 'dol', 'tgc', 'wbfs', 'ciso', 'gcz', 'wad' ],
    'genesis_plus_gx'  : [ 'mdx', 'md', 'smd', 'gen', 'sms', 'gg', 'sg', '68k', 'chd' ],
    'nestopia'         : [ 'nes', 'fds', 'unf', 'unif' ],
    'mupen64plus_next' : [ 'n64', 'v64', 'z64', 'u1', 'ndd' ],
    'parallel_n64'     : [ 'n64', 'v64', 'z64', 'u1', 'ndd' ],
    'citra'            : [ '3ds', '3dsx', 'cci', 'cxi' ],
    'desmume'          : [ 'nds', 'srl' ],
    'beetle_psx'       : [ 'ccd', 'iso' ],
    'ppsspp'           : [ 'cso', 'pbp' ],
    'snes9x'           : [ 'smc', 'sfc', 'swc', 'fig', 'bs', 'st' ],
  };

  constructor
  (
    private readonly elementRef : ElementRef,
    private changeDetectorRef   : ChangeDetectorRef,
    private renderer            : Renderer2,
    private translateService    : TranslateService,
  )
  {
    this.wasmReadySub      = this.wasmReadySubscription();
    this.toggleStatesSub   = this.toggleStatesSubscription();
    this.toggleControlsSub = this.toggleControlsSubscription();
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Init ----------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public async ngOnInit() : Promise<void>
  {
    ForageHelper.init();

    ContainerQueryHelper.watchResize();

    this.initI18n();

    this.initModule();

    // NOTE Load core
    await this.loadCore();

    // NOTE Load ROM
    await this.loadRom();

    // NOTE Try to load asset bundle
    await this.loadAssetBundle();
  }

  public ngOnDestroy() : void
  {
    this.wasmReadySub.unsubscribe();
    this.toggleStatesSub.unsubscribe();
    this.toggleControlsSub.unsubscribe();
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Actions -------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public async onClickPlay() : Promise<void>
  {
    await this.initCore();
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Main ----------------------------------------------------------------
  // -------------------------------------------------------------------------------

  private initI18n() : void
  {
    // NOTE Get const by string
    let locale = null;
    switch (this.lang)
    {
      case 'en' : locale = English; break;
      case 'fr' : locale = French;  break;
    }

    // NOTE Set translation
    this.translateService.setDefaultLang('en');
    this.translateService.use(this.lang);
    this.translateService.setTranslation(this.lang, locale);
  }

  /** NOTE Step 0 */
  private initModule() : void
  {
    // NOTE Get canvas element
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    // NOTE Update Module.canvas
    window['Module'].canvas = this.canvas;

    // NOTE Mute Retroarch logging
    if (!this.development)
    {
      window['Module'].print    = (text) => {};
      window['Module'].printErr = (text) => {};
    }
  }

  /** NOTE Step 1 */
  private loadCore() : Promise<void>
  {
    if (!this.installedCores.includes(this.core))
      throw new Error(`EmulatorComponent : loadCore -> Could not load specified core "${this.core}". Here is a list of available cores [${this.installedCores.join(', ')}]`);

    // NOTE Load core
    return new Promise((resolve, reject) =>
    {
      const script  = this.renderer.createElement('script');
      script.src    = this.assetPath + this.core + '_libretro' + (this.development ? '' : '.min') + '.js';
      script.onload = () =>
      {
        this.devLog('1 - Core ready');
        return resolve();
      };
      this.renderer.appendChild(this.elementRef.nativeElement, script);
    });
  }

  /** NOTE Step 1.1 */
  private async loadRom() : Promise<void>
  {
    if (!this.rom)
      throw new Error(`EmulatorComponent : loadRom -> ROM is required.`);

    // NOTE Get ROM file
    const pathToRom = this.romPath + this.rom;
    let   blob      = await this.getFile(pathToRom, 'blob') as Blob | null;
    if (!blob)
      throw new Error(`EmulatorComponent : loadRom -> Unable to fetch ROM at ${pathToRom}`);

    // NOTE Get ROM extension
    const fileExt = this.rom.split('.').pop();

    // NOTE Unzip file
    if (fileExt === 'zip')
      blob = await this.unzipFile(blob);

    // NOTE Check ROM extension
    else if (!this.fileExts[this.core].includes(fileExt))
      throw new Error(`EmulatorComponent : loadRom -> Invalid ROM file for "${this.core}" core. Are you using the right core?`);

    const arrayBuffer = await blob.arrayBuffer();

    this.romName  = this.rom.split('.')[0];
    this.romData  = new Uint8Array(arrayBuffer);
    this.romReady = true;
    this.changeDetectorRef.detectChanges();
    this.devLog('1.1 - ROM ready' , '#421e8a');
  }

  /** NOTE Step 2.1 : Not mandatory */
  private async loadAssetBundle() : Promise<void>
  {
    if (!this.romReady || !this.wasmReady)
      return this.devLog(`Unable to load the asset bundle : ${!this.romReady ? 'ROM' : 'WASM'} is not ready yet!`, 'none', '#F5BD00');

    const fsBundleDirs = [['', 'assets'], ['/assets', 'menu_widgets'], ['/assets', 'ozone'], ['/assets/ozone', 'png'], ['/assets/ozone/png', 'dark'], ['/assets/ozone/png', 'sidebar'], ['/assets', 'xmb'], ['/assets/xmb', 'monochrome'], ['/assets/xmb/monochrome', 'png']];

    FS.createPath('/', FsPath.BUNDLE, true, true);
    for (let i = 0; i < fsBundleDirs.length; i++)
      FS.createPath('/' + FsPath.BUNDLE + fsBundleDirs[i][0], fsBundleDirs[i][1], true, true);

    // NOTE Get list of assets
    const fileName = 'indexedfiles.txt';
    const fileList = await this.getFile(this.assetPath + fileName, 'text') as string | null;
    if (!fileList)
      return this.setBundleReady();

    // NOTE Get & load assets
    const fsBundleFiles : string[] = fileList.split('\n');
    for (let y = 0; y < fsBundleFiles.length; y++)
    {
      const assetFile = await this.getFile(this.assetPath + fsBundleFiles[y].trim(), 'arrayBuffer') as ArrayBuffer | null;
      if (!assetFile)
        continue;
      FS.writeFile('/' + FsPath.BUNDLE + fsBundleFiles[y].trim(), new Uint8Array(assetFile));
    }
    this.setBundleReady();
  }

  private setBundleReady() : void
  {
    this.devLog('2.1 - Assets ready', '#421e8a');
    this.bundleReady = true;
    this.changeDetectorRef.detectChanges();

    // NOTE Auto play
    // setTimeout(_ => {
      this.onClickPlay();
    // }, 500);
  }

  /** NOTE Step 3 */
  private async initCore() : Promise<void>
  {
    if (!this.romReady || !this.bundleReady)
      return;

    // NOTE Init player config
    const config = StorageHelper.getConfig(this.core, this.romName);
    this.playerConfig = config ?? new PlayerConfig();
    this.devLog(`Retroarch configuration has been ${config ? 'loaded from cache' : 'generated'}`, 'none', '#47C186');

    // NOTE Set ROM
    FS.writeFile(FsPath.ROM, this.romData);

    // NOTE Set config
    FS.createPath('/', FsPath.USERDATA, true, true);
    FS.writeFile(FsPath.CONFIG, this.mainConfig.asRetroarchConfig() + this.playerConfig.asRetroarchConfig());

    // NOTE Start emulator
    window['Module'].callMain(window['Module'].arguments);
    this.gameStarted = true;
    this.changeDetectorRef.detectChanges();

    this.devLog('3 - Game started');

    // NOTE Remove wheel event listener : Unable to preventDefault inside passive event listener invocation.
    JSEvents.removeAllHandlersOnTarget(document, 'wheel');
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Helpers -------------------------------------------------------------
  // -------------------------------------------------------------------------------

  private devLog(msg : string, background ?: string, color ?: string) : void
  {
    if (!this.development)
      return;
    console.log(`%c ${msg} `, `background: ${background ? background : '#7b37ff'}; color: ${color ? color : '#fff'}`);
  }

  private async unzipFile(blob : Blob) : Promise<Blob>
  {
    const { entries } = await unzip(blob);
    const fileNames   = Object.keys(entries);

    // NOTE Empty zip
    if (!fileNames.length)
      throw new Error('EmulatorComponent : unzipFile -> That zip file appears to be empty!');

    // NOTE Check file extension
    let rom : string = null;
    for (let fileName of fileNames)
    {
      let fileExt = fileName.split('.').pop();
      if (this.fileExts[this.core].includes(fileExt))
        rom = fileName;
    }

    if (!rom)
      throw new Error(`EmulatorComponent : unzipFile -> Couldn't find a valid ROM file for "${this.core}" core in that zip file. Are you using the right core?`);

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

        console.warn(`EmulatorComponent : getFile -> Unable to fetch file at ${filePath}`);
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
      this.devLog('2 - WASM ready');
      this.wasmReady = true;

      // NOTE Try to load asset bundle
      this.loadAssetBundle();
    });
  }

  private toggleStatesSubscription() : Subscription
  {
    return EmitterHelper.emitToggleStates.subscribe(state =>
    {
      this.showStates = state;
      this.changeDetectorRef.detectChanges();
    });
  }

  private toggleControlsSubscription() : Subscription
  {
    return EmitterHelper.emitToggleControls.subscribe(state =>
    {
      this.showControls = state;
      this.changeDetectorRef.detectChanges();
    });
  }
}
