// Models
import { Config }        from './config.model';

export class PlayerConfig extends Config
{
  // NOTE Player 1
  public input_player1_a         : string = 'x';
  public input_player1_b         : string = 'c';
  public input_player1_x         : string = 's';
  public input_player1_y         : string = 'z';
  public input_player1_up        : string = 'up';
  public input_player1_down      : string = 'down';
  public input_player1_left      : string = 'left';
  public input_player1_right     : string = 'right';
  public input_player1_start     : string = 'enter';
  public input_player1_select    : string = 'shift';
  public input_player1_l         : string = 'a';
  public input_player1_r         : string = 'd';
  public input_player1_l2        : string = 'q';
  public input_player1_r2        : string = 'w';
  public input_player1_l3        : string = 'r';
  public input_player1_r3        : string = 'f';
  public input_player1_l_x_plus  : string = null;
  public input_player1_l_x_minus : string = null;
  public input_player1_l_y_plus  : string = null;
  public input_player1_l_y_minus : string = null;
  public input_player1_r_x_plus  : string = null;
  public input_player1_r_x_minus : string = null;
  public input_player1_r_y_plus  : string = null;
  public input_player1_r_y_minus : string = null;

  // NOTE Player 2
  public input_player2_a         : string = null;
  public input_player2_b         : string = null;
  public input_player2_x         : string = null;
  public input_player2_y         : string = null;
  public input_player2_up        : string = null;
  public input_player2_down      : string = null;
  public input_player2_left      : string = null;
  public input_player2_right     : string = null;
  public input_player2_start     : string = null;
  public input_player2_select    : string = null;
  public input_player2_l         : string = null;
  public input_player2_r         : string = null;
  public input_player2_l2        : string = null;
  public input_player2_r2        : string = null;
  public input_player2_l3        : string = null;
  public input_player2_r3        : string = null;
  public input_player2_l_x_plus  : string = null;
  public input_player2_l_x_minus : string = null;
  public input_player2_l_y_plus  : string = null;
  public input_player2_l_y_minus : string = null;
  public input_player2_r_x_plus  : string = null;
  public input_player2_r_x_minus : string = null;
  public input_player2_r_y_plus  : string = null;
  public input_player2_r_y_minus : string = null;

  // NOTE Player 3
  public input_player3_a         : string = null;
  public input_player3_b         : string = null;
  public input_player3_x         : string = null;
  public input_player3_y         : string = null;
  public input_player3_up        : string = null;
  public input_player3_down      : string = null;
  public input_player3_left      : string = null;
  public input_player3_right     : string = null;
  public input_player3_start     : string = null;
  public input_player3_select    : string = null;
  public input_player3_l         : string = null;
  public input_player3_r         : string = null;
  public input_player3_l2        : string = null;
  public input_player3_r2        : string = null;
  public input_player3_l_x_plus  : string = null;
  public input_player3_l_x_minus : string = null;
  public input_player3_l_y_plus  : string = null;
  public input_player3_l_y_minus : string = null;
  public input_player3_r_x_plus  : string = null;
  public input_player3_r_x_minus : string = null;
  public input_player3_r_y_plus  : string = null;
  public input_player3_r_y_minus : string = null;

  // NOTE Player 4
  public input_player4_a         : string = null;
  public input_player4_b         : string = null;
  public input_player4_x         : string = null;
  public input_player4_y         : string = null;
  public input_player4_up        : string = null;
  public input_player4_down      : string = null;
  public input_player4_left      : string = null;
  public input_player4_right     : string = null;
  public input_player4_start     : string = null;
  public input_player4_select    : string = null;
  public input_player4_l         : string = null;
  public input_player4_r         : string = null;
  public input_player4_l2        : string = null;
  public input_player4_r2        : string = null;
  public input_player4_l_x_plus  : string = null;
  public input_player4_l_x_minus : string = null;
  public input_player4_l_y_plus  : string = null;
  public input_player4_l_y_minus : string = null;
  public input_player4_r_x_plus  : string = null;
  public input_player4_r_x_minus : string = null;
  public input_player4_r_y_plus  : string = null;
  public input_player4_r_y_minus : string = null;

  // NOTE Dpad
  public input_player1_analog_dpad_mode : string = '1';
  public input_player2_analog_dpad_mode : string = '1';
  public input_player3_analog_dpad_mode : string = '1';
  public input_player4_analog_dpad_mode : string = '1';

  constructor(json ?: any)
  {
    super();

    if (!json)
      return;

    for (let key of Object.keys(json))
      if (key in this)
        this[key] = json[key];

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
  }
}