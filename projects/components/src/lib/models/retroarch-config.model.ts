// Models
import { Config } from './config.model';

export class RetroarchConfig extends Config
{
  public config_save_on_exit    : boolean = false;
  public rgui_show_start_screen : boolean = false;
  public pause_nonactive        : boolean = true;

  // public input_remap_binds_enable : string = 'o';
  // public input_autodetect_enable : boolean = true;
  // public input_overlay_enable : boolean = true;
  public input_reset : string = null;

  public input_menu_toggle : string = 'f1';
  public input_save_state  : string = 'f2';
  public input_load_state  : string = 'f3';

  constructor()
  {
    super();
  }
}