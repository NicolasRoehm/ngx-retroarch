// Angular modules
import { Injectable }   from '@angular/core';

// Models
import { PlayerConfig } from '../models/player-config.model';

// Types
import { Core }         from '../types/core.type';

@Injectable()
export class StorageHelper
{
  private static storagePrefix : string = 'ngx-retroarch_';

  // ----------------------------------------------------------------------------------------------
  // SECTION Methods ------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------

  // NOTE Keys

  public static setConfig(playerConfig : PlayerConfig, core : Core, romName : string = null) : void
  {
    romName ? StorageHelper.setItem(`${core}_${romName}_cfg`, playerConfig) : StorageHelper.setItem(`${core}_cfg`, playerConfig);
  }

  public static getConfig(core : Core, romName : string) : PlayerConfig | null
  {
    const json = StorageHelper.getItem(`${core}_${romName}_cfg`) || StorageHelper.getItem(`${core}_cfg`);
    if (!json)
      return null;
    return new PlayerConfig(json);
  }

  // !SECTION Methods

  // ----------------------------------------------------------------------------------------------
  // SECTION LocalStorage -------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------

  private static setItem(key : string, value : any, prefix : boolean = true) : void
  {
    const itemKey = this.prefixer(key, prefix);
    localStorage.setItem(itemKey, JSON.stringify(value));
  }

  private static getItem(key : string, prefix : boolean = true) : any
  {
    const itemKey = this.prefixer(key, prefix);
    const res = localStorage.getItem(itemKey);
    if (res !== 'undefined')
      return JSON.parse(res);
    console.error('StorageHelper : getItem -> undefined key');
    return null;
  }

  // !SECTION LocalStorage

  // NOTE Private

  private static prefixer(key : string, autoPrefix : boolean) : string
  {
    let itemKey = key;
    if (autoPrefix)
      itemKey = this.storagePrefix + key;
    return itemKey;
  }

}
