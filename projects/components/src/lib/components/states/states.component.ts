// Angular modules
import { ChangeDetectorRef }       from '@angular/core';
import { Input }                   from '@angular/core';
import { Component }               from '@angular/core';
import { OnInit }                  from '@angular/core';
import { DomSanitizer }                  from '@angular/platform-browser';

// Helpers
import { ForageHelper }            from '../../helpers/forage.helper';

// Models
import { GameState }               from '../../models/game-state.model';

// NOTE Retroarch variables
declare const wasmTable : any;
declare const FS : any;

@Component({
  selector    : 'ngx-states',
  templateUrl : './states.component.html',
  styleUrls   : ['./states.component.scss'],
  animations  : [],
})
export class StatesComponent implements OnInit
{
  // NOTE Inherited properties
  @Input() romName : string;

  // NOTE Component properties
  public states : GameState[] = [];

  constructor
  (
    private sanitizer : DomSanitizer
  )
  {

  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Init ----------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public ngOnInit() : void
  {
    this.getStates();
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Actions -------------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // ---- NOTE Computed props ------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // ---- NOTE Requests ------------------------------------------------------------
  // -------------------------------------------------------------------------------

  private async getStates() : Promise<void>
  {
    const stateKeys = await ForageHelper.scanGameStates(this.romName);
    let states : GameState[] = [];
    for (let stateKey of stateKeys)
    {
      let state = await ForageHelper.getGameState(stateKey);
      state.safeImg = this.sanitizer.bypassSecurityTrustResourceUrl(state.img);
      states.push(state);
    }
    this.states = states;
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Helpers -------------------------------------------------------------
  // -------------------------------------------------------------------------------

}
