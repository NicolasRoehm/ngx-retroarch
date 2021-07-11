// Angular modules
import { Component }          from '@angular/core';
import { ElementRef }         from '@angular/core';
import { Input }              from '@angular/core';
import { OnInit }             from '@angular/core';

// External modules
import { SimpleModalService } from 'ngx-simple-modal';

// Types
import { Core }               from '../../types/core.type';

// Components
import { ControlsComponent }  from '../controls/controls.component';

// Models
import { MainConfig }         from '../../models/main-config.model';
import { PlayerConfig }       from '../../models/player-config.model';

declare const RA : any;
declare const Browser : any;

@Component({
  selector    : 'ngx-hud',
  templateUrl : './hud.component.html',
  styleUrls   : ['./hud.component.scss']
})
export class HudComponent implements OnInit
{
  // NOTE Inherited properties
  @Input() core         : Core;
  @Input() romName      : string;
  @Input() mainConfig   : MainConfig;
  @Input() playerConfig : PlayerConfig;

  // NOTE Component properties
  public  isFullscreen  : boolean = false;
  public  isPaused      : boolean = false;
  public  defaultVolume : number  = 100;
  public  volume        : number  = this.defaultVolume;

  private audioOverride : boolean = false;

  constructor
  (
    private simpleModalService : SimpleModalService,
    private elementRef         : ElementRef
  )
  {

  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Init ----------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public async ngOnInit() : Promise<void>
  {
    this.fullscreenSubscription();
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Actions -------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public onClickShowControls() : void
  {
    // NOTE Add class to wrapper
    (this.elementRef.nativeElement.parentElement as Element).classList.add('modal-open');

    // NOTE Pause
    this.onClickTogglePlayPause(true);

    // NOTE Open modal
    let disposable = this.simpleModalService.addModal(ControlsComponent, {
      core         : this.core,
      romName      : this.romName,
      mainConfig   : this.mainConfig,
      playerConfig : this.playerConfig,
    })
    .subscribe((isConfirmed : boolean) =>
    {
      // NOTE Closing modal

      // NOTE Remove class from wrapper
      (this.elementRef.nativeElement.parentElement as Element).classList.remove('modal-open');

      // NOTE Play
      this.onClickTogglePlayPause(false);

      // We get modal result
      if(isConfirmed) {
        console.log('accepted');
      }
      else {
        console.log('declined');
      }
    });
    // We can close modal calling disposable.unsubscribe();
    // If modal was not closed manually close it by timeout
    // setTimeout(()=>{
    //     disposable.unsubscribe();
    // },10000);
  }

  public onChangeVolume(volume : number) : void
  {
    // FIXME Gain can be controlled in runtime with input_volume_up/input_volume_down/

    this.volume = volume * 0.01;

    // NOTE Overide audio loop
    if (!this.audioOverride)
    {
      this.overrideQueueAudio();
      this.audioOverride = true;
      return;
    }
  }

  public onClickTogglePlayPause(setPause : boolean = null) : void
  {
    if (!this.isPaused && (setPause === null || setPause === true))
    {
      this.isPaused = true;
      window['Module'].pauseMainLoop();
      return;
    }
    if (this.isPaused && (setPause === null || setPause === false))
    {
      window['Module'].resumeMainLoop();
      this.isPaused = false;
    }
  }

  public async onClickToggleFullscreen() : Promise<void>
  {
    if (!this.isFullscreen)
    {
      (this.elementRef.nativeElement.parentElement as Element).requestFullscreen();
      this.isFullscreen = true;
      return;
    }
    // NOTE exitFullscreen is only available on the Document object
    document.exitFullscreen();
    this.isFullscreen = false;
    // NOTE Resize canvas
    Browser.setWindowedCanvasSize();
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Helpers -------------------------------------------------------------
  // -------------------------------------------------------------------------------

  private overrideQueueAudio() : void
  {
    // It comes from unminified snes9x_libretro.js file at line 1266
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
    gainNode.gain.setValueAtTime(this.volume, RA.context.currentTime);
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Subscription --------------------------------------------------------
  // -------------------------------------------------------------------------------

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
        Browser.setWindowedCanvasSize();
      }
    });
  }

}
