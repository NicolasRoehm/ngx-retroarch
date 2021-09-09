// Angular modules
import { Injectable }   from '@angular/core';

// External modules
import * as localForage from 'localforage';

// Models
import { GameState }    from '../models/game-state.model';

// @dynamic
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
      name        : this.storagePrefix,
      version     : 1.0,
      storeName   : 'game_states',
      description : 'Ngx-RetroArch game states'
    });
  }

  public static async setGameState(gameState : GameState) : Promise<void>
  {
    await localForage.setItem(gameState.id, gameState);
  }

  public static async getGameState(storeName : string) : Promise<GameState>
  {
    return await localForage.getItem(storeName);
  }

  public static async scanGameStates(romName : string) : Promise<string[]>
  {
    const keys = await localForage.keys();
    let romKeys : string[] = [];
    for (let key of keys)
      if (key.startsWith(romName))
        romKeys.push(key);
    return romKeys;
  }

  // !SECTION Methods

  // ----------------------------------------------------------------------------------------------
  // SECTION LocalStorage -------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------

  // !SECTION LocalStorage

  // NOTE Private
}
