// Enums
import { DefaultKeys } from '../enums/default-keys.enum';
import { PlayerKeys }  from '../enums/player-keys.enum';

// Models
import { Config } from './config.model';

export class PlayerConfig extends Config
{
  // NOTE Player 1
  public input_player1_a         : string = 's';
  public input_player1_b         : string = 'tab';
  public input_player1_x         : string = 'x';
  public input_player1_y         : string = 'capslock';
  public input_player1_up        : string = 'q';
  public input_player1_down      : string = 'a';
  public input_player1_left      : string = 'z';
  public input_player1_right     : string = 'w';
  public input_player1_start     : string = 'ctrl';
  public input_player1_select    : string = 'shift';
  public input_player1_l         : string = 'alt';
  public input_player1_r         : string = 'e';
  public input_player1_l2        : string = 'd';
  public input_player1_r2        : string = 'c';
  public input_player1_l3        : string = 'r';
  public input_player1_r3        : string = 'f';
  public input_player1_l_x_plus  : string = 'v';
  public input_player1_l_x_minus : string = 't';
  public input_player1_l_y_plus  : string = 'b';
  public input_player1_l_y_minus : string = 'g';
  public input_player1_r_x_plus  : string = 'y';
  public input_player1_r_x_minus : string = 'h';
  public input_player1_r_y_plus  : string = 'u';
  public input_player1_r_y_minus : string = 'n';

  // NOTE Player 2
  public input_player2_a         : string = 'p';
  public input_player2_b         : string = 'j';
  public input_player2_x         : string = 'pageup';
  public input_player2_y         : string = 'm';
  public input_player2_up        : string = 'comma';
  public input_player2_down      : string = 'o';
  public input_player2_left      : string = 'l';
  public input_player2_right     : string = 'period';
  public input_player2_start     : string = 'k';
  public input_player2_select    : string = 'i';
  public input_player2_l         : string = 'slash';
  public input_player2_r         : string = 'leftbracket';
  public input_player2_l2        : string = 'quote';
  public input_player2_r2        : string = 'rightbracket';
  public input_player2_l3        : string = 'tilde';
  public input_player2_r3        : string = 'space';
  public input_player2_l_x_plus  : string = 'backslash';
  public input_player2_l_x_minus : string = 'insert';
  public input_player2_l_y_plus  : string = 'backspace';
  public input_player2_l_y_minus : string = 'pause';
  public input_player2_r_x_plus  : string = 'pagedown';
  public input_player2_r_x_minus : string = 'enter';
  public input_player2_r_y_plus  : string = 'keypad2';
  public input_player2_r_y_minus : string = 'keypad1';

  // NOTE Player 3
  public input_player3_a         : string = 'minus';
  public input_player3_b         : string = 'keypad3';
  public input_player3_x         : string = 'equals';
  public input_player3_y         : string = 'keypad4';
  public input_player3_up        : string = 'keypad7';
  public input_player3_down      : string = 'keypad8';
  public input_player3_left      : string = 'keypad9';
  public input_player3_right     : string = 'keypad0';
  public input_player3_start     : string = 'keypad6';
  public input_player3_select    : string = 'keypad5';
  public input_player3_l         : string = 'f1';
  public input_player3_r         : string = 'f2';
  public input_player3_l2        : string = 'f3';
  public input_player3_r2        : string = 'f4';
  public input_player3_l_x_plus  : string = 'f5';
  public input_player3_l_x_minus : string = 'f6';
  public input_player3_l_y_plus  : string = 'f8';
  public input_player3_l_y_minus : string = 'f7';
  public input_player3_r_x_plus  : string = 'f9';
  public input_player3_r_x_minus : string = 'f10';
  public input_player3_r_y_plus  : string = 'f12';
  public input_player3_r_y_minus : string = 'f11';

  // NOTE Player 4
  public input_player4_a         : string = 'num8';
  public input_player4_b         : string = 'num0';
  public input_player4_x         : string = 'num9';
  public input_player4_y         : string = 'num1';
  public input_player4_up        : string = 'num4';
  public input_player4_down      : string = 'num5';
  public input_player4_left      : string = 'num6';
  public input_player4_right     : string = 'num7';
  public input_player4_start     : string = 'num3';
  public input_player4_select    : string = 'num2';
  public input_player4_l         : string = 'home';
  public input_player4_r         : string = 'divide';
  public input_player4_l2        : string = 'multiply';
  public input_player4_r2        : string = 'subtract';
  public input_player4_l_x_plus  : string = 'right';
  public input_player4_l_x_minus : string = 'left';
  public input_player4_l_y_plus  : string = 'down';
  public input_player4_l_y_minus : string = 'up';
  public input_player4_r_x_plus  : string = 'tilde';
  public input_player4_r_x_minus : string = 'space';
  public input_player4_r_y_plus  : string = 'escape';
  public input_player4_r_y_minus : string = 'end';

  // NOTE Dpad
  public input_player1_analog_dpad_mode : string = '1';
  public input_player2_analog_dpad_mode : string = '1';
  public input_player3_analog_dpad_mode : string = '1';
  public input_player4_analog_dpad_mode : string = '1';

  constructor()
  {
    super();
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
  }
}