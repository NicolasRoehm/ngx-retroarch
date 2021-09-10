// Angular modules
import { Component }         from '@angular/core';
import { EventEmitter }      from '@angular/core';
import { Output }            from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector      : 'ngx-play-btn',
  templateUrl   : './play-btn.component.html',
  styleUrls     : ['./play-btn.component.scss'],
  encapsulation : ViewEncapsulation.ShadowDom
})
export class PlayBtnComponent
{
  @Output() playEvent = new EventEmitter<void>();

  constructor() {}

  // -------------------------------------------------------------------------------
  // ---- NOTE Init ----------------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // ---- NOTE Actions -------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public onClickPlay() : void
  {
    this.playEvent.emit();
  }
}