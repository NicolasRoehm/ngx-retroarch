// Models
import { PlayerConfig } from './player-config.model';

export class Controls
{
  // NOTE Dpad
  public dpad_up    : string = null;
  public dpad_down  : string = null;
  public dpad_left  : string = null;
  public dpad_right : string = null;

  // NOTE Buttons
  public btn_start  : string = null;
  public btn_select : string = null;
  public btn_a      : string = null;
  public btn_b      : string = null;
  public btn_x      : string = null;
  public btn_y      : string = null;
  public btn_l      : string = null;
  public btn_r      : string = null;

  constructor(pConf ?: PlayerConfig, player ?: number)
  {
    if (!pConf || !player)
      return;
    this.fromPlayerConfig(pConf, player);
  }

  public static getPropByAction(action : string) : string
  {
    const endOfProp = `_${action}`;
    const props     = Object.keys(new Controls());
    return props.find(p => p.endsWith(endOfProp));
  }

  private fromPlayerConfig(pConf : PlayerConfig, player : number) : void
  {
    const search = `input_player${player}_`;

    // NOTE Controls & Player config keys
    const cKeys = Object.keys(this);
    const pKeys = Object.keys(pConf);

    // NOTE Remove (dpad / btn) prefixes from controls
    const ctrls : string[] = [];
    for (let cKey of cKeys)
      ctrls.push(cKey.split('_').pop());

    // NOTE Parse Player config keys
    for (let pKey of pKeys)
    {
      // NOTE Check player
      if (!pKey.startsWith(search))
        continue;

      // NOTE Remove playerX prefix
      const ctrl = pKey.replace(search, '');
      if (!ctrls.includes(ctrl))
        continue;

      // NOTE Set value
      const ctrlKey = cKeys.find(k => k.endsWith(ctrl));
      this[ctrlKey] = pConf[pKey];
    }
  }

  public toPlayerConfig() : void
  {
    // TODO
  }
}