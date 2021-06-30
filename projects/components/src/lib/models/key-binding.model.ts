// Enums
import { DefaultKeys } from '../enums/default-keys.enum';
import { PlayerKeys }  from '../enums/player-keys.enum';

export class GameControls
{
  input_menu_toggle : string;
  input_save_state  : string;
  input_load_state  : string;

  constructor()
  {
    for (let i = 1; i <= 4; i++)
      this.addPlayerKeys(i);

    this.input_menu_toggle = 'f1';
    this.input_save_state  = 'f2';
    this.input_load_state  = 'f3';
  }

  public asRetroarchConfig() : string
  {
    const keys = Object.keys(this);
    let response = '';
    for (const key of keys)
      response += key + ' = "' + this[key] + '"\n';
    return response;
  }

  private addPlayerKeys(id : number) : void
  {
    const prefix = `input_player${id}_`;
    const keys   = Object.keys(PlayerKeys).filter(key => isNaN(Number(key)));
    for (const key of keys)
      this[prefix + key] = id === 1 ? DefaultKeys[key] : '';
  }
}