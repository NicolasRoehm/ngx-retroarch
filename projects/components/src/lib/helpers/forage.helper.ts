// Angular modules
import { Injectable } from '@angular/core';

// External modules
import * as localForage from 'localforage';

@Injectable()
export class ForageHelper
{
  private static storagePrefix : string = 'ngx-retroarch';

  // ----------------------------------------------------------------------------------------------
  // SECTION Methods ------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------

  public static init() : void
  {
    localForage.config({
      driver      : localForage.INDEXEDDB,
      name        : ForageHelper.storagePrefix,
      version     : 1.0,
      storeName   : 'game_states',
      description : 'Ngx-RetroArch game states'
    });
  }

  public static async setGameState(gameState : Uint8Array) : Promise<void>
  {
    const storeName = 'state' + ForageHelper.getDateSuffix();
    await localForage.setItem(storeName, gameState);
  }

  public static async getGameState(storeName : string) : Promise<Uint8Array>
  {
    return await localForage.getItem(storeName);
  }

  public static async scanGameStates() : Promise<string[]>
  {
    return await localForage.keys();
  }

  // !SECTION Methods

  // ----------------------------------------------------------------------------------------------
  // SECTION LocalStorage -------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------

  // !SECTION LocalStorage

  // NOTE Private

  private static getDateSuffix() : string
  {
    const date    = new Date();
    const day     = date.getDate()        < 10 ? '0' + date.getDate()        : date.getDate();
    const month   = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    const hours   = date.getHours()       < 10 ? '0' + date.getHours()       : date.getHours();
    const minutes = date.getMinutes()     < 10 ? '0' + date.getMinutes()     : date.getMinutes();
    const seconds = date.getSeconds()     < 10 ? '0' + date.getSeconds()     : date.getSeconds();
    return `_${date.getFullYear()}-${month}-${day}_${hours}:${minutes}:${seconds}`;
  }
}
