// Angular modules
import { Component }  from '@angular/core';
import { ElementRef } from '@angular/core';
import { OnInit }     from '@angular/core';

declare const RA : any;

@Component({
  selector    : 'ngx-hud',
  templateUrl : './hud.component.html',
  styleUrls   : ['./hud.component.scss']
})
export class HudComponent implements OnInit
{
  public  isFullscreen  : boolean = false;
  public  isPaused      : boolean = false;
  public  defaultVolume : number  = 100;
  public  volume        : number  = this.defaultVolume;

  private audioOverride : boolean = false;

  constructor
  (
    private elementRef : ElementRef
  )
  {

  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Init ----------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public async ngOnInit() : Promise<void>
  {
    // (RA.context as AudioContext).onstatechange = (ev) => {
    //   console.log(ev);
    //   console.log(RA.context.state);
    // };
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Actions -------------------------------------------------------------
  // -------------------------------------------------------------------------------

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

  public onClickTogglePlayPause() : void
  {
    if (!this.isPaused)
    {
      this.isPaused = true;
      window['Module'].pauseMainLoop();
      return;
    }
    window['Module'].resumeMainLoop();
    this.isPaused = false;
  }

  public async onClickToggleFullscreen() : Promise<void>
  {
    if (!this.isFullscreen)
    {
      (this.elementRef.nativeElement.parentElement as Element).requestFullscreen();
      this.isFullscreen = true;
      return;
    }
    // TODO Listen on "escape" pressed (exited fullscreen)
    document.exitFullscreen();
    this.isFullscreen = false;
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

}
