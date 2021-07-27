// Angular modules
import { ChangeDetectorRef }       from '@angular/core';
import { Component }               from '@angular/core';
import { ElementRef }              from '@angular/core';
import { ViewChild }               from '@angular/core';
import { OnInit }                  from '@angular/core';

// External modules
import { zoomInOnEnterAnimation }  from 'angular-animations';
import { zoomOutOnLeaveAnimation } from 'angular-animations';
import { SimpleModalComponent }    from 'ngx-simple-modal';

// Helpers
import { StorageHelper }           from '../../helpers/storage.helper';

// Models
import { PlayerConfig }            from '../../models/player-config.model';
import { MainConfig }              from '../../models/main-config.model';
import { Controls }                from '../../models/controls.model';

// Enums
import { FsPath }                  from '../../enums/fs-path.enum';

// Types
import { Core }                    from '../../types/core.type';

// NOTE Retroarch variables
declare const wasmTable : any;
declare const FS : any;

export interface ControlsModel {
  core         : Core;
  romName      : string;
  mainConfig   : MainConfig;
  playerConfig : PlayerConfig;
}

@Component({
  selector    : 'ngx-controls',
  templateUrl : './controls.component.html',
  styleUrls   : ['./controls.component.scss'],
  animations  : [
    zoomInOnEnterAnimation({ duration : 100 }),
    zoomOutOnLeaveAnimation({ duration : 300 }),
  ],
})
export class ControlsComponent extends SimpleModalComponent<ControlsModel, boolean> implements ControlsModel, OnInit
{
  // NOTE Inherited properties
  public core         : Core;
  public romName      : string;
  public mainConfig   : MainConfig;
  public playerConfig : PlayerConfig;

  // NOTE Component properties
  public players      : number = 4;
  public activePlayer : number = 1;

  public listenerHasFocus : boolean = false;
  public showListener     : boolean = false;
  @ViewChild('keyListener') listenerEl : ElementRef<HTMLElement>;

  public controls : Controls[] = [];

  constructor(private changeDetectorRef : ChangeDetectorRef)
  {
    super();
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Init ----------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public ngOnInit() : void
  {
    this.setControls();
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Actions -------------------------------------------------------------
  // -------------------------------------------------------------------------------

  confirm() {
    // we set modal result as true on click on confirm button,
    // then we can get modal result from caller code
    this.result = true;
    this.close();
  }

  // selectTab(tab: Tab)
  // {
  //   // deactivate all tabs
  //   this.tabs.toArray().forEach(tab => tab.active = false);

  //   // activate the tab the user has clicked on.
  //   tab.active = true;
  // }

  public onClickEditKey() : void
  {
    this.showListener = true;
    this.changeDetectorRef.detectChanges();

    // NOTE Keyboard event listener
    this.listenerEl.nativeElement.addEventListener('keydown', (e) =>
    {
      // TODO Show new key
      // this.saveConfig();
      setTimeout(() =>
      {
        this.showListener = false;
      }, 2000);
    });
    // NOTE Focus element
    this.listenerEl.nativeElement.focus();

    // TODO Add gamepad event listener
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Computed props ------------------------------------------------------
  // -------------------------------------------------------------------------------

  public updateKeyboardLabel(value : string) : string
  {
    switch (value)
    {
      case 'up' :
        return '↑';
      case 'down' :
        return '↓';
      case 'left' :
        return '←';
      case 'right' :
        return '→';
      case 'enter' :
        return value + ' ↵';
    }
    return value;
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Main ----------------------------------------------------------------
  // -------------------------------------------------------------------------------

  private saveConfig() : void
  {
    // TODO Prevent double key definition

    const config = new PlayerConfig();
    config.input_player1_a = 'l';
    StorageHelper.setConfig(config, this.core, this.romName);

    FS.writeFile(FsPath.CONFIG, this.mainConfig.asRetroarchConfig() + config.asRetroarchConfig());
    wasmTable.get(108)();

    this.result = true;
    this.close();
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Helpers -------------------------------------------------------------
  // -------------------------------------------------------------------------------

  private setControls() : void
  {
    let controls : Controls[] = [];
    for (let i = 1; i <= this.players; i++)
      controls.push(new Controls(this.playerConfig, i));
    this.controls = controls;
  }

}
