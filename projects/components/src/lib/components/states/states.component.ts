// Angular modules
import { ChangeDetectorRef }       from '@angular/core';
import { AfterViewInit }           from '@angular/core';
import { ViewEncapsulation }       from '@angular/core';
import { Input }                   from '@angular/core';
import { Component }               from '@angular/core';
import { ElementRef }              from '@angular/core';
import { ViewChild }               from '@angular/core';
import { OnInit }                  from '@angular/core';
import { DomSanitizer }            from '@angular/platform-browser';

// Helpers
import { ForageHelper }            from '../../helpers/forage.helper';
import { EmitterHelper }           from '../../helpers/emitter.helper';
import { ContainerQueryHelper }    from '../../helpers/container-query.helper';

// Models
import { GameState }               from '../../models/game-state.model';

// Enums
import { FsPath }                  from '../../enums/fs-path.enum';

// NOTE Retroarch variables
declare const FS : any;

@Component({
  selector      : 'ngx-states',
  templateUrl   : './states.component.html',
  styleUrls     : [
    './states.component.scss',
    '../../styles/modal.scss',
    '../../styles/grid.scss',
  ],
  animations    : [],
  encapsulation : ViewEncapsulation.ShadowDom
})
export class StatesComponent implements OnInit, AfterViewInit
{
  // NOTE Inherited properties
  @Input() romName : string;

  // NOTE Component properties
  public states : GameState[] = [];
  @ViewChild('dataObserveResizes') dataObserveResizes : ElementRef<HTMLElement>;

  constructor
  (
    private sanitizer         : DomSanitizer,
    private changeDetectorRef : ChangeDetectorRef
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

  public ngAfterViewInit() : void
  {
    ContainerQueryHelper.watchResize(this.dataObserveResizes.nativeElement);
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Actions -------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public onClickClose() : void
  {
    // NOTE Close component
    EmitterHelper.sendToggleStates(false);
    // NOTE Resume
    EmitterHelper.sendTogglePause(false);
  }

  public async onClickLoad(stateId : string) : Promise<void>
  {
    // NOTE Get state by id
    const state = await ForageHelper.getGameState(stateId);

    // NOTE Define selected state as last one
    FS.writeFile(FsPath.STATE, state.state);

    // NOTE Load state
    window['Module']._cmd_load_state();

    // NOTE Close
    this.onClickClose();
  }

  public async onClickDelete(stateId : string) : Promise<void>
  {
    // NOTE Remove state from localForage
    await ForageHelper.deleteGameState(stateId);

    // NOTE Remove state from displayed list
    this.states = this.states.filter(s => s.id !== stateId);

    this.changeDetectorRef.detectChanges();
  }

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

    states.sort((a, b) => a.date < b.date ? 1 : -1);
    this.states = states;

    this.changeDetectorRef.detectChanges();
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Helpers -------------------------------------------------------------
  // -------------------------------------------------------------------------------

}
