// Models
import { Config } from './config.model';

// 2013 https://gist.github.com/oscarrenalias/5504943
// 2019 https://github.com/waveshare/GamePi15/blob/master/retropie/opt/retropie/configs/all/retroarch.cfg

export class MainConfig extends Config
{
  public config_save_on_exit    : boolean = false;
  public rgui_show_start_screen : boolean = false;
  public pause_nonactive        : boolean = true;

  // NOTE Dpad
  public input_player1_analog_dpad_mode : string = '1';
  public input_player2_analog_dpad_mode : string = '1';
  public input_player3_analog_dpad_mode : string = '1';
  public input_player4_analog_dpad_mode : string = '1';

  public input_menu_toggle       : string = 'f1';
  public input_save_state        : string = 'f2';
  public input_load_state        : string = 'f3';
  public input_reset             : string = null;
  public input_audio_mute        : string = null;
  public input_rewind            : string = null;
  public input_frame_advance     : string = null;
  public input_slowmotion        : string = null;
  public input_pause_toggle      : string = null;
  public input_toggle_fullscreen : string = null;

  public input_toggle_fast_forward_btn   : string = null;
  public input_toggle_fast_forward_axis  : string = null;
  public input_hold_fast_forward         : string = null;
  public input_hold_fast_forward_btn     : string = null;
  public input_hold_fast_forward_axis    : string = null;
  public input_load_state_btn            : string = null;
  public input_load_state_axis           : string = null;
  public input_save_state_btn            : string = null;
  public input_save_state_axis           : string = null;
  public input_toggle_fullscreen_btn     : string = null;
  public input_toggle_fullscreen_axis    : string = null;
  public input_exit_emulator_btn         : string = null;
  public input_exit_emulator_axis        : string = null;
  public input_state_slot_increase       : string = null;
  public input_state_slot_increase_btn   : string = null;
  public input_state_slot_increase_axis  : string = null;
  public input_state_slot_decrease       : string = null;
  public input_state_slot_decrease_btn   : string = null;
  public input_state_slot_decrease_axis  : string = null;
  public input_rewind_btn                : string = null;
  public input_rewind_axis               : string = null;
  public input_movie_record_toggle_btn   : string = null;
  public input_movie_record_toggle_axis  : string = null;
  public input_pause_toggle_btn          : string = null;
  public input_pause_toggle_axis         : string = null;
  public input_frame_advance_btn         : string = null;
  public input_frame_advance_axis        : string = null;
  public input_reset_btn                 : string = null;
  public input_reset_axis                : string = null;
  public input_shader_next               : string = null;
  public input_shader_next_btn           : string = null;
  public input_shader_next_axis          : string = null;
  public input_shader_prev               : string = null;
  public input_shader_prev_btn           : string = null;
  public input_shader_prev_axis          : string = null;
  public input_cheat_index_plus          : string = null;
  public input_cheat_index_plus_btn      : string = null;
  public input_cheat_index_plus_axis     : string = null;
  public input_cheat_index_minus         : string = null;
  public input_cheat_index_minus_btn     : string = null;
  public input_cheat_index_minus_axis    : string = null;
  public input_cheat_toggle              : string = null;
  public input_cheat_toggle_btn          : string = null;
  public input_cheat_toggle_axis         : string = null;
  public input_screenshot_btn            : string = null;
  public input_screenshot_axis           : string = null;
  public input_audio_mute_btn            : string = null;
  public input_audio_mute_axis           : string = null;
  public input_osk_toggle                : string = null;
  public input_osk_toggle_btn            : string = null;
  public input_osk_toggle_axis           : string = null;
  public input_netplay_flip_players      : string = null;
  public input_netplay_flip_players_btn  : string = null;
  public input_netplay_flip_players_axis : string = null;
  public input_slowmotion_btn            : string = null;
  public input_slowmotion_axis           : string = null;
  public input_enable_hotkey             : string = null;
  public input_enable_hotkey_btn         : string = null;
  public input_enable_hotkey_axis        : string = null;
  public input_volume_up                 : string = null;
  public input_volume_up_btn             : string = null;
  public input_volume_up_axis            : string = null;
  public input_volume_down               : string = null;
  public input_volume_down_btn           : string = null;
  public input_volume_down_axis          : string = null;
  public input_overlay_next              : string = null;
  public input_overlay_next_btn          : string = null;
  public input_overlay_next_axis         : string = null;
  public input_disk_eject_toggle         : string = null;
  public input_disk_eject_toggle_btn     : string = null;
  public input_disk_eject_toggle_axis    : string = null;
  public input_disk_next                 : string = null;
  public input_disk_next_btn             : string = null;
  public input_disk_next_axis            : string = null;
  public input_disk_prev                 : string = null;
  public input_disk_prev_btn             : string = null;
  public input_disk_prev_axis            : string = null;
  public input_grab_mouse_toggle         : string = null;
  public input_grab_mouse_toggle_btn     : string = null;
  public input_grab_mouse_toggle_axis    : string = null;
  public input_menu_toggle_btn           : string = null;
  public input_menu_toggle_axis          : string = null;

  constructor()
  {
    super();
  }
}