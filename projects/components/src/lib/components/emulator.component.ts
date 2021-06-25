// Angular modules
import { Component }  from '@angular/core';
import { ElementRef } from '@angular/core';
import { OnInit }     from '@angular/core';
import { Renderer2 }  from '@angular/core';

import { unzip } from 'unzipit';

declare const FS : any;
declare const Module : any;

@Component({
  selector: 'lib-components',
  template: `
    <p>
      test works!
    </p>
  `,
  styles: [
  ]
})
export class EmulatorComponent implements OnInit
{
  private core        : string = 'snes9x';
  private keybinds    : string = 'input_player1_start = "enter"\ninput_player1_select = "space"\ninput_player1_l = "e"\ninput_player1_l2 = "r"\ninput_player1_r = "p"\ninput_player1_r2 = "o"\ninput_player1_a = "h"\ninput_player1_b = "g"\ninput_player1_x = "y"\ninput_player1_y = "t"\ninput_player1_up = "up"\ninput_player1_left = "left"\ninput_player1_down = "down"\ninput_player1_right = "right"\ninput_player1_l_x_minus = "a"\ninput_player1_l_x_plus = "d"\ninput_player1_l_y_minus = "w"\ninput_player1_l_y_plus = "s"\ninput_player1_l3_btn = "x"\ninput_player1_r_x_minus = "j"\ninput_player1_r_x_plus = "l"\ninput_player1_r_y_minus = "i"\ninput_player1_r_y_plus = "k"\ninput_player1_r3_btn = "comma"\ninput_menu_toggle = "f1"\ninput_save_state = "f2"\ninput_load_state = "f3"\n';
  private nulKeys     : string = 'input_ai_service = "nul"\ninput_ai_service_axis = "nul"\ninput_ai_service_btn = "nul"\ninput_ai_service_mbtn = "nul"\ninput_audio_mute = "nul"\ninput_audio_mute_axis = "nul"\ninput_audio_mute_btn = "nul"\ninput_audio_mute_mbtn = "nul"\ninput_cheat_index_minus = "nul"\ninput_cheat_index_minus_axis = "nul"\ninput_cheat_index_minus_btn = "nul"\ninput_cheat_index_minus_mbtn = "nul"\ninput_cheat_index_plus = "nul"\ninput_cheat_index_plus_axis = "nul"\ninput_cheat_index_plus_btn = "nul"\ninput_cheat_index_plus_mbtn = "nul"\ninput_cheat_toggle = "nul"\ninput_cheat_toggle_axis = "nul"\ninput_cheat_toggle_btn = "nul"\ninput_cheat_toggle_mbtn = "nul"\ninput_desktop_menu_toggle = "nul"\ninput_desktop_menu_toggle_axis = "nul"\ninput_desktop_menu_toggle_btn = "nul"\ninput_desktop_menu_toggle_mbtn = "nul"\ninput_disk_eject_toggle = "nul"\ninput_disk_eject_toggle_axis = "nul"\ninput_disk_eject_toggle_btn = "nul"\ninput_disk_eject_toggle_mbtn = "nul"\ninput_disk_next = "nul"\ninput_disk_next_axis = "nul"\ninput_disk_next_btn = "nul"\ninput_disk_next_mbtn = "nul"\ninput_disk_prev = "nul"\ninput_disk_prev_axis = "nul"\ninput_disk_prev_btn = "nul"\ninput_disk_prev_mbtn = "nul"\ninput_duty_cycle = "nul"\ninput_enable_hotkey = "nul"\ninput_enable_hotkey_axis = "nul"\ninput_enable_hotkey_btn = "nul"\ninput_enable_hotkey_mbtn = "nul"\ninput_exit_emulator = "nul"\ninput_exit_emulator_axis = "nul"\ninput_exit_emulator_btn = "nul"\ninput_exit_emulator_mbtn = "nul"\ninput_fps_toggle = "nul"\ninput_fps_toggle_axis = "nul"\ninput_fps_toggle_btn = "nul"\ninput_fps_toggle_mbtn = "nul"\ninput_frame_advance = "nul"\ninput_frame_advance_axis = "nul"\ninput_frame_advance_btn = "nul"\ninput_frame_advance_mbtn = "nul"\ninput_game_focus_toggle = "nul"\ninput_game_focus_toggle_axis = "nul"\ninput_game_focus_toggle_btn = "nul"\ninput_game_focus_toggle_mbtn = "nul"\ninput_grab_mouse_toggle = "nul"\ninput_grab_mouse_toggle_axis = "nul"\ninput_grab_mouse_toggle_btn = "nul"\ninput_grab_mouse_toggle_mbtn = "nul"\ninput_hold_fast_forward = "nul"\ninput_hold_fast_forward_axis = "nul"\ninput_hold_fast_forward_btn = "nul"\ninput_hold_fast_forward_mbtn = "nul"\ninput_hold_slowmotion = "nul"\ninput_slowmotion = "nul"\ninput_hold_slowmotion_axis = "nul"\ninput_hold_slowmotion_btn = "nul"\ninput_hold_slowmotion_mbtn = "nul"\ninput_hotkey_block_delay = "nul"\ninput_load_state_axis = "nul"\ninput_load_state_btn = "nul"\ninput_load_state_mbtn = "nul"\ninput_menu_toggle_axis = "nul"\ninput_menu_toggle_btn = "nul"\ninput_menu_toggle_mbtn = "nul"\ninput_movie_record_toggle = "nul"\ninput_movie_record_toggle_axis = "nul"\ninput_movie_record_toggle_btn = "nul"\ninput_movie_record_toggle_mbtn = "nul"\ninput_netplay_game_watch = "nul"\ninput_netplay_game_watch_axis = "nul"\ninput_netplay_game_watch_btn = "nul"\ninput_netplay_game_watch_mbtn = "nul"\ninput_netplay_host_toggle = "nul"\ninput_netplay_host_toggle_axis = "nul"\ninput_netplay_host_toggle_btn = "nul"\ninput_netplay_host_toggle_mbtn = "nul"\ninput_osk_toggle = "nul"\ninput_osk_toggle_axis = "nul"\ninput_osk_toggle_btn = "nul"\ninput_osk_toggle_mbtn = "nul"\ninput_overlay_next = "nul"\ninput_overlay_next_axis = "nul"\ninput_overlay_next_btn = "nul"\ninput_overlay_next_mbtn = "nul"\ninput_pause_toggle = "nul"\ninput_pause_toggle_axis = "nul"\ninput_pause_toggle_btn = "nul"\ninput_pause_toggle_mbtn = "nul"\ninput_player1_a_axis = "nul"\ninput_player1_a_btn = "nul"\ninput_player1_a_mbtn = "nul"\ninput_player1_b_axis = "nul"\ninput_player1_b_btn = "nul"\ninput_player1_b_mbtn = "nul"\ninput_player1_down_axis = "nul"\ninput_player1_down_btn = "nul"\ninput_player1_down_mbtn = "nul"\ninput_player1_gun_aux_a = "nul"\ninput_player1_gun_aux_a_axis = "nul"\ninput_player1_gun_aux_a_btn = "nul"\ninput_player1_gun_aux_a_mbtn = "nul"\ninput_player1_gun_aux_b = "nul"\ninput_player1_gun_aux_b_axis = "nul"\ninput_player1_gun_aux_b_btn = "nul"\ninput_player1_gun_aux_b_mbtn = "nul"\ninput_player1_gun_aux_c = "nul"\ninput_player1_gun_aux_c_axis = "nul"\ninput_player1_gun_aux_c_btn = "nul"\ninput_player1_gun_aux_c_mbtn = "nul"\ninput_player1_gun_dpad_down = "nul"\ninput_player1_gun_dpad_down_axis = "nul"\ninput_player1_gun_dpad_down_btn = "nul"\ninput_player1_gun_dpad_down_mbtn = "nul"\ninput_player1_gun_dpad_left = "nul"\ninput_player1_gun_dpad_left_axis = "nul"\ninput_player1_gun_dpad_left_btn = "nul"\ninput_player1_gun_dpad_left_mbtn = "nul"\ninput_player1_gun_dpad_right = "nul"\ninput_player1_gun_dpad_right_axis = "nul"\ninput_player1_gun_dpad_right_btn = "nul"\ninput_player1_gun_dpad_right_mbtn = "nul"\ninput_player1_gun_dpad_up = "nul"\ninput_player1_gun_dpad_up_axis = "nul"\ninput_player1_gun_dpad_up_btn = "nul"\ninput_player1_gun_dpad_up_mbtn = "nul"\ninput_player1_gun_offscreen_shot = "nul"\ninput_player1_gun_offscreen_shot_axis = "nul"\ninput_player1_gun_offscreen_shot_btn = "nul"\ninput_player1_gun_offscreen_shot_mbtn = "nul"\ninput_player1_gun_select = "nul"\ninput_player1_gun_select_axis = "nul"\ninput_player1_gun_select_btn = "nul"\ninput_player1_gun_select_mbtn = "nul"\ninput_player1_gun_start = "nul"\ninput_player1_gun_start_axis = "nul"\ninput_player1_gun_start_btn = "nul"\ninput_player1_gun_start_mbtn = "nul"\ninput_player1_gun_trigger = "nul"\ninput_player1_gun_trigger_axis = "nul"\ninput_player1_gun_trigger_btn = "nul"\ninput_player1_gun_trigger_mbtn = "nul"\ninput_player1_l2_axis = "nul"\ninput_player1_l2_btn = "nul"\ninput_player1_l2_mbtn = "nul"\ninput_player1_l3 = "nul"\ninput_player1_l3_axis = "nul"\ninput_player1_l3_mbtn = "nul"\ninput_player1_l_axis = "nul"\ninput_player1_l_btn = "nul"\ninput_player1_l_mbtn = "nul"\ninput_player1_l_x_minus_axis = "nul"\ninput_player1_l_x_minus_btn = "nul"\ninput_player1_l_x_minus_mbtn = "nul"\ninput_player1_l_x_plus_axis = "nul"\ninput_player1_l_x_plus_btn = "nul"\ninput_player1_l_x_plus_mbtn = "nul"\ninput_player1_l_y_minus_axis = "nul"\ninput_player1_l_y_minus_btn = "nul"\ninput_player1_l_y_minus_mbtn = "nul"\ninput_player1_l_y_plus_axis = "nul"\ninput_player1_l_y_plus_btn = "nul"\ninput_player1_l_y_plus_mbtn = "nul"\ninput_player1_left_axis = "nul"\ninput_player1_left_mbtn = "nul"\ninput_player1_r2_axis = "nul"\ninput_player1_r2_btn = "nul"\ninput_player1_r2_mbtn = "nul"\ninput_player1_r3 = "nul"\ninput_player1_r3_axis = "nul"\ninput_player1_r3_mbtn = "nul"\ninput_player1_r_axis = "nul"\ninput_player1_r_btn = "nul"\ninput_player1_r_mbtn = "nul"\ninput_player1_r_x_minus_axis = "nul"\ninput_player1_r_x_minus_btn = "nul"\ninput_player1_r_x_minus_mbtn = "nul"\ninput_player1_r_x_plus_axis = "nul"\ninput_player1_r_x_plus_btn = "nul"\ninput_player1_r_x_plus_mbtn = "nul"\ninput_player1_r_y_minus_axis = "nul"\ninput_player1_r_y_minus_btn = "nul"\ninput_player1_r_y_minus_mbtn = "nul"\ninput_player1_r_y_plus_axis = "nul"\ninput_player1_r_y_plus_btn = "nul"\ninput_player1_r_y_plus_mbtn = "nul"\ninput_player1_right_axis = "nul"\ninput_player1_right_mbtn = "nul"\ninput_player1_select_axis = "nul"\ninput_player1_select_btn = "nul"\ninput_player1_select_mbtn = "nul"\ninput_player1_start_axis = "nul"\ninput_player1_start_btn = "nul"\ninput_player1_start_mbtn = "nul"\ninput_player1_turbo = "nul"\ninput_player1_turbo_axis = "nul"\ninput_player1_turbo_btn = "nul"\ninput_player1_turbo_mbtn = "nul"\ninput_player1_up_axis = "nul"\ninput_player1_up_btn = "nul"\ninput_player1_up_mbtn = "nul"\ninput_player1_x_axis = "nul"\ninput_player1_x_btn = "nul"\ninput_player1_x_mbtn = "nul"\ninput_player1_y_axis = "nul"\ninput_player1_y_btn = "nul"\ninput_player1_y_mbtn = "nul"\ninput_poll_type_behavior = "nul"\ninput_recording_toggle = "nul"\ninput_recording_toggle_axis = "nul"\ninput_recording_toggle_btn = "nul"\ninput_recording_toggle_mbtn = "nul"\ninput_reset = "nul"\ninput_reset_axis = "nul"\ninput_reset_btn = "nul"\ninput_reset_mbtn = "nul"\ninput_rewind = "nul"\ninput_rewind_axis = "nul"\ninput_rewind_btn = "nul"\ninput_rewind_mbtn = "nul"\ninput_save_state_axis = "nul"\ninput_save_state_btn = "nul"\ninput_save_state_mbtn = "nul"\ninput_screenshot = "nul"\ninput_screenshot_axis = "nul"\ninput_screenshot_btn = "nul"\ninput_screenshot_mbtn = "nul"\ninput_send_debug_info = "nul"\ninput_send_debug_info_axis = "nul"\ninput_send_debug_info_btn = "nul"\ninput_send_debug_info_mbtn = "nul"\ninput_shader_next = "nul"\ninput_shader_next_axis = "nul"\ninput_shader_next_btn = "nul"\ninput_shader_next_mbtn = "nul"\ninput_shader_prev = "nul"\ninput_shader_prev_axis = "nul"\ninput_shader_prev_btn = "nul"\ninput_shader_prev_mbtn = "nul"\ninput_state_slot_decrease = "nul"\ninput_state_slot_decrease_axis = "nul"\ninput_state_slot_decrease_btn = "nul"\ninput_state_slot_decrease_mbtn = "nul"\ninput_state_slot_increase = "nul"\ninput_state_slot_increase_axis = "nul"\ninput_state_slot_increase_btn = "nul"\ninput_state_slot_increase_mbtn = "nul"\ninput_streaming_toggle = "nul"\ninput_streaming_toggle_axis = "nul"\ninput_streaming_toggle_btn = "nul"\ninput_streaming_toggle_mbtn = "nul"\ninput_toggle_fast_forward = "nul"\ninput_toggle_fast_forward_axis = "nul"\ninput_toggle_fast_forward_btn = "nul"\ninput_toggle_fast_forward_mbtn = "nul"\ninput_toggle_fullscreen = "nul"\ninput_toggle_fullscreen_axis = "nul"\ninput_toggle_fullscreen_btn = "nul"\ninput_toggle_fullscreen_mbtn = "nul"\ninput_toggle_slowmotion = "nul"\ninput_toggle_slowmotion_axis = "nul"\ninput_toggle_slowmotion_btn = "nul"\ninput_toggle_slowmotion_mbtn = "nul"\ninput_turbo_default_button = "nul"\ninput_turbo_mode = "nul"\ninput_turbo_period = "nul"\ninput_volume_down = "nul"\ninput_volume_down_axis = "nul"\ninput_volume_down_btn = "nul"\ninput_volume_down_mbtn = "nul"\ninput_volume_up = "nul"\ninput_volume_up_axis = "nul"\ninput_volume_up_btn = "nul"\ninput_volume_up_mbtn = "nul"\n';
  private extraConfig : string = 'rgui_show_start_screen = "false"\n';

  constructor
  (
    private readonly elementRef : ElementRef,
    private renderer : Renderer2
  )
  {

  }

  ngOnInit()
  {
    this.loadCode(this.core);
  }

  private loadCode(core : string) : void
  {
    const script  = this.renderer.createElement('script');
    script.src    = './' + core + '_libretro.js';
    script.onload = () =>
    {
      console.log('script loaded');
      this.initFromFile();
    };
    this.renderer.appendChild(this.elementRef.nativeElement, script);
  }

  private initFromFile()
  {
    fetch('./Goof_Troop.zip')
      .then(res => res.blob()) // NOTE Gets the response and returns it as a blob
      .then(async (blob) =>
      {
        const { entries } = await unzip(blob);
        // NOTE Read an entry as an ArrayBuffer
        const arrayBuffer = await entries['Goof_Troop.smc'].arrayBuffer();
        const bytes       = new Uint8Array(arrayBuffer);
        setTimeout(() => {
          this.initFromData(bytes);
        }, 10000);
      });
  }

  private initFromData(data : Uint8Array)
  {
    window.onbeforeunload = function() { return true; };

    // rom
    FS.writeFile('/rom.bin', data);

    // config
    FS.createPath('/', 'home/web_user/retroarch/userdata', true, true);
    FS.writeFile('/home/web_user/retroarch/userdata/retroarch.cfg', this.nulKeys + this.keybinds + this.extraConfig);

    // start
    Module.callMain(Module.arguments);
  }
}
