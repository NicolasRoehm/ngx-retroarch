// Angular modules
import { Component }                    from '@angular/core';
import { OnDestroy }                    from '@angular/core';
import { ChangeDetectorRef }            from '@angular/core';
import { ElementRef }                   from '@angular/core';
import { Input }                        from '@angular/core';
import { OnInit }                       from '@angular/core';

// External modules
import { slideInUpOnEnterAnimation }    from 'angular-animations';
import { slideOutDownOnLeaveAnimation } from 'angular-animations';
import { fromEvent }                    from 'rxjs';
import { Subscription }                 from 'rxjs';
import { timer }                        from 'rxjs';
import { sample }                       from 'rxjs/operators';
import                                       'range-slider-element/dist/index.js';

// Types
import { Core }                         from '../../types/core.type';

// Models
import { MainConfig }                   from '../../models/main-config.model';
import { PlayerConfig }                 from '../../models/player-config.model';
import { GameState }                    from '../../models/game-state.model';

// Helpers
import { EmitterHelper }                from '../../helpers/emitter.helper';
import { ForageHelper }                 from '../../helpers/forage.helper';
import { EmulatorHelper }               from '../../helpers/emulator.helper';

// Enums
import { FsPath }                       from '../../enums/fs-path.enum';

// NOTE Retroarch variables
declare const FS : any;
declare const RA : any;
declare const Browser : any;

@Component({
  selector    : 'ngx-hud',
  templateUrl : './hud.component.html',
  styleUrls   : ['./hud.component.scss'],
  animations  : [
    slideInUpOnEnterAnimation({ duration : 200 }),
    slideOutDownOnLeaveAnimation({ duration : 200 }),
  ],
})
export class HudComponent implements OnInit, OnDestroy
{
  // NOTE Inherited properties
  @Input() canvas       : HTMLCanvasElement;
  @Input() core         : Core;
  @Input() romName      : string;
  @Input() mainConfig   : MainConfig;
  @Input() playerConfig : PlayerConfig;

  // NOTE Component properties
  public  isFullscreen   : boolean = false;
  public  isPaused       : boolean = false;
  public  isMuted        : boolean = false;
  public  isMouseMoving  : boolean = false;
  public  isHUDHovered   : boolean = false;
  public  defaultVolume  : number  = 1; // From 0 to 1 with 0.01 by step
  public  volume         : number  = this.defaultVolume;
  private togglePauseSub : Subscription;

  private movingTimeout : ReturnType<typeof setTimeout>;
  private audioOverride : boolean = false;

  constructor
  (
    private elementRef        : ElementRef,
    private changeDetectorRef : ChangeDetectorRef,
  )
  {
    this.togglePauseSub = this.togglePauseSubscription();
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Init ----------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public async ngOnInit() : Promise<void>
  {
    this.overrideQueueAudio();
    this.fullscreenSubscription();
    this.watchDebouncedMouse();
  }

  public ngOnDestroy() : void
  {
    this.togglePauseSub.unsubscribe();
  }

  private watchDebouncedMouse() : void
  {
    // NOTE Starts at 0 and gives 1,2,3 as values each 1000 milliseconds
    const eachSecond$ = timer(0, 1000);
    const mouseMove$  = fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mousemove');

    const mouseMoveEachSecond$ = eachSecond$.pipe(sample(mouseMove$));

    mouseMoveEachSecond$.subscribe(_ => this.setIsMouseMoving());
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Actions -------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public onMouseEnterHUD() : void
  {
    this.isHUDHovered = true;
    clearTimeout(this.movingTimeout);
  }

  public onLeaveEnterHUD() : void
  {
    this.isHUDHovered = false;
    this.setIsMouseMoving();
  }

  public onClickShowStates() : void
  {
    // NOTE Pause
    this.onClickTogglePlayPause(true);
    // NOTE Open states
    EmitterHelper.sendToggleStates(true);
  }

  public onClickShowControls() : void
  {
    // NOTE Pause
    this.onClickTogglePlayPause(true);
    // NOTE Open controls
    EmitterHelper.sendToggleControls(true);
  }

  public onInputVolume(volume : number) : void
  {
    this.volume = volume * 0.01;
    // NOTE Unmute
    if (this.volume > 0 && this.isMuted)
      this.isMuted = false;
    this.changeDetectorRef.detectChanges();
  }

  public onClickToggleMute() : void
  {
    this.isMuted = !this.isMuted;
    this.changeDetectorRef.detectChanges();
  }

  public onClickTogglePlayPause(setPause : boolean = null) : void
  {
    if (!this.isPaused && (setPause === null || setPause === true))
    {
      this.isPaused = true;
      this.changeDetectorRef.detectChanges();
      window['Module'].pauseMainLoop();
      return;
    }
    if (this.isPaused && (setPause === null || setPause === false))
    {
      window['Module'].resumeMainLoop();
      this.isPaused = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  public async onClickToggleFullscreen() : Promise<void>
  {
    if (!this.isFullscreen)
    {
      (this.elementRef.nativeElement.parentElement as Element).requestFullscreen();
      this.isFullscreen = true;
      this.changeDetectorRef.detectChanges();
      return;
    }
    // NOTE exitFullscreen is only available on the Document object
    document.exitFullscreen();
    this.isFullscreen = false;
    // NOTE Resize canvas
    if (!this.isPaused)
      Browser.setWindowedCanvasSize();
    this.changeDetectorRef.detectChanges();
  }

  public async onClickQuickSave() : Promise<void>
  {
    // TODO Show loader

    // NOTE Delete previous save
    const path : any = FS.analyzePath(FsPath.STATE);
    if (path.object && path.object.contents)
      FS.unlink(FsPath.STATE);

    // NOTE Save state
    window['Module']._cmd_save_state();

    // NOTE Get file
    const file = await EmulatorHelper.readAsyncFile(FsPath.STATE);
    // NOTE Get index
    const index : number = (await ForageHelper.scanGameStates(this.romName)).length;

    // NOTE Create game state
    const gameState = new GameState(index + 1, this.romName, file);
    gameState.img   = await EmulatorHelper.getScreenshot();

    // NOTE Store game state
    await ForageHelper.setGameState(gameState);

    // TODO Hide loader
  }

  public async onClickQuickLoad() : Promise<void>
  {
    // NOTE Get states
    const states = await ForageHelper.scanGameStates(this.romName);
    if (!states.length)
      return;

    // NOTE Get last state
    states.sort().reverse();
    const state = await ForageHelper.getGameState(states[0]);

    // NOTE Define selected state as last one
    FS.writeFile(FsPath.STATE, state.state);

    // NOTE Load state
    window['Module']._cmd_load_state();
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Helpers -------------------------------------------------------------
  // -------------------------------------------------------------------------------

  private overrideQueueAudio() : void
  {
    // NOTE Overide audio loop
    if (this.audioOverride)
      return;

    this.audioOverride = true;

    // NOTE It comes from unminified snes9x_libretro.js file at line 1266
    RA.queueAudio = function () {
      var index = RA.bufIndex;
      var startTime;
      if (RA.bufIndex) startTime = RA.buffers[RA.bufIndex - 1].endTime;
      else startTime = RA.context.currentTime;
      RA.buffers[index].endTime = startTime + RA.buffers[index].duration;
      const bufferSource = RA.context.createBufferSource();
      bufferSource.buffer = RA.buffers[index];
      // bufferSource.connect(RA.context.destination); // NOTE Commented
      this.setVolume(bufferSource); // NOTE Added
      bufferSource.start(startTime);
      RA.bufIndex++;
      RA.bufOffset = 0;
    }.bind(this);
  }

  private setVolume(bufferSource : AudioBufferSourceNode) : void
  {
    const gainNode = RA.context.createGain();
    gainNode.connect(RA.context.destination);
    bufferSource.connect(gainNode);
    gainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, RA.context.currentTime);
  }

  public setIsMouseMoving() : void
  {
    if (this.isHUDHovered)
      return;

    if (this.isMouseMoving)
    {
      clearTimeout(this.movingTimeout);
      this.setMovingTimeout();
      return;
    }
    this.isMouseMoving = true;
    this.changeDetectorRef.detectChanges();
    this.setMovingTimeout();
  }

  private setMovingTimeout() : void
  {
    this.movingTimeout = setTimeout(_ =>
    {
      this.isMouseMoving = false;
      this.changeDetectorRef.detectChanges();
    }, 3000);
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Subscription --------------------------------------------------------
  // -------------------------------------------------------------------------------

  private togglePauseSubscription() : Subscription
  {
    return EmitterHelper.emitTogglePause.subscribe(state =>
    {
      this.onClickTogglePlayPause(state);
    });
  }

  private fullscreenSubscription() : void
  {
    (this.elementRef.nativeElement.parentElement as Element).addEventListener('fullscreenchange', (event) =>
    {
      // NOTE document.fullscreenElement will point to the element that
      // is in fullscreen mode if there is one. If not, the value
      // of the property is null.
      if (!document.fullscreenElement)
      {
        this.isFullscreen = false;
        // NOTE Resize canvas
        if (!this.isPaused)
          Browser.setWindowedCanvasSize();
        this.changeDetectorRef.detectChanges();
      }
    });
  }

}
