// Angular modules
import { ChangeDetectorRef }       from '@angular/core';
import { AfterViewInit }           from '@angular/core';
import { ViewEncapsulation }       from '@angular/core';
import { Input }                   from '@angular/core';
import { Component }               from '@angular/core';
import { ElementRef }              from '@angular/core';
import { ViewChild }               from '@angular/core';
import { OnInit }                  from '@angular/core';

// External modules
import { zoomInOnEnterAnimation }  from 'angular-animations';
import { zoomOutOnLeaveAnimation } from 'angular-animations';
import { TranslateService }        from '@ngx-translate/core';

// Helpers
import { StorageHelper }           from '../../helpers/storage.helper';
import { EmitterHelper }           from '../../helpers/emitter.helper';
import { ContainerQueryHelper }    from '../../helpers/container-query.helper';

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

@Component({
  selector      : 'ngx-controls',
  templateUrl   : './controls.component.html',
  styleUrls     : [
    './controls.component.scss',
    '../../styles/modal.scss',
    '../../styles/grid.scss'
  ],
  animations    : [
    zoomInOnEnterAnimation({ duration : 100 }),
    zoomOutOnLeaveAnimation({ duration : 300 }),
  ],
  encapsulation : ViewEncapsulation.ShadowDom
})
export class ControlsComponent implements OnInit, AfterViewInit
{
  // NOTE Inherited properties
  @Input() core         : Core;
  @Input() romName      : string;
  @Input() mainConfig   : MainConfig;
  @Input() playerConfig : PlayerConfig;

  // NOTE Component properties
  public players      : number = 4;
  public activePlayer : number = 1;

  public curAction        : string  = '';
  public curAssignedKey   : string  = null;
  public newAssignedKey   : string  = null;
  public overwritePlayer  : number  = null;
  public overwriteCmd     : string  = '';
  public listenerHasFocus : boolean = false;
  public showListener     : boolean = false;
  @ViewChild('keyListener') listenerEl : ElementRef<HTMLElement>;
  @ViewChild('dataObserveResizes') dataObserveResizes : ElementRef<HTMLElement>;

  public controls : Controls[] = [];

  constructor
  (
    private changeDetectorRef : ChangeDetectorRef,
    private translateService  : TranslateService
  )
  {

  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Init ----------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public ngOnInit() : void
  {
    this.setControls();
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
    EmitterHelper.sendToggleControls(false);
    // NOTE Resume
    EmitterHelper.sendTogglePause(false);
  }

  public onClickChangeTab(i : number) : void
  {
    this.activePlayer = i + 1;
    this.changeDetectorRef.detectChanges();
  }

  public onClickCloseListener() : void
  {
    this.showListener = false;
    this.changeDetectorRef.detectChanges();
  }

  public onClickSave(saveByCore : boolean) : void
  {
    if (saveByCore)
    {
      StorageHelper.setConfig(this.playerConfig, this.core);
      // NOTE Delete config by current rom
      StorageHelper.removeRomConfig(this.core, this.romName);
    }
    else
      StorageHelper.setConfig(this.playerConfig, this.core, this.romName);

    // NOTE Reload config
    FS.writeFile(FsPath.CONFIG, this.mainConfig.asRetroarchConfig() + this.playerConfig.asRetroarchConfig());
    // FIXME Module._cmd_reload_config(); https://github.com/BinBashBanana/webretro/issues/2
    wasmTable.get(108)();

    // NOTE Close
    this.onClickClose();
  }

  public onClickEditKey(action : string) : void
  {
    this.overwritePlayer = null;
    this.overwriteCmd    = null;
    this.curAssignedKey  = null;
    this.newAssignedKey  = null;

    // NOTE Open listener
    this.showListener = true;

    // NOTE Show current assigned action & key
    const modelKey      = `input_player${this.activePlayer}_${action}`;
    this.curAction      = this.translateService.instant(action.toUpperCase());
    this.curAssignedKey = this.playerConfig[modelKey];
    this.changeDetectorRef.detectChanges();

    // NOTE Keyboard event listener
    this.listenerEl.nativeElement.addEventListener('keydown', (e) =>
    {
      // NOTE Convert pressed key
      const keyboardValue = PlayerConfig.convertKeyboardValue(e);

      // NOTE Assign new key
      const overwrite = this.playerConfig.setKey(modelKey, keyboardValue);

      // NOTE Show overwrite
      if (overwrite && overwrite !== modelKey)
      {
        const withoutPrefix  = overwrite.replace('input_player', '');
        this.overwritePlayer = Number(withoutPrefix.charAt(0)); // NOTE Player number - (ex : 1)
        this.overwriteCmd    = withoutPrefix.substring(2);      // NOTE Action - (ex : select)

        // NOTE Update displayed controls
        const controlProp = Controls.getPropByAction(this.overwriteCmd);
        this.controls[this.overwritePlayer - 1][controlProp] = null;
      }

      // NOTE Show new assigned key
      this.newAssignedKey = keyboardValue;

      // NOTE Update displayed controls
      const controlProp = Controls.getPropByAction(action);
      this.controls[this.activePlayer - 1][controlProp] = keyboardValue;

      this.changeDetectorRef.detectChanges();

      // NOTE Close listener
      setTimeout(() =>
      {
        this.showListener = false;
        this.changeDetectorRef.detectChanges();
      }, this.overwriteCmd ? 5000 : 2000);
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
      case null :
        return this.translateService.instant('UNDEFINED');
    }
    return value;
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Main ----------------------------------------------------------------
  // -------------------------------------------------------------------------------

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
