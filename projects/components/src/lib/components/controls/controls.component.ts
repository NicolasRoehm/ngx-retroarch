// Angular modules
import { Component }            from '@angular/core';
import { OnInit }               from '@angular/core';

// External modules
import { SimpleModalComponent } from 'ngx-simple-modal';

// Helpers
import { StorageHelper }        from '../../helpers/storage.helper';

// Models
import { PlayerConfig }         from '../../models/player-config.model';
import { MainConfig }           from '../../models/main-config.model';
import { Controls }             from '../../models/controls.model';

// Enums
import { FsPath }               from '../../enums/fs-path.enum';

// Types
import { Core }                 from '../../types/core.type';

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
  styleUrls   : ['./controls.component.scss']
})
export class ControlsComponent extends SimpleModalComponent<ControlsModel, boolean> implements ControlsModel, OnInit
{
  // NOTE Inherited properties
  public core         : Core;
  public romName      : string;
  public mainConfig   : MainConfig;
  public playerConfig : PlayerConfig;

  // NOTE Component properties
  public players   : number = 4;
  public activeTab : number = 1;

  public controls : Controls;

  constructor()
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
    this.saveConfig();
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
    this.controls = new Controls(this.playerConfig, this.activeTab);
  }

}
