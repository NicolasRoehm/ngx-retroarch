// Angular modules
import { Injectable }   from '@angular/core';
import { EventEmitter } from '@angular/core';

@Injectable()
export class EmitterHelper
{
  public static emitWasmReady      : EventEmitter<void>    = new EventEmitter();
  public static emitToggleControls : EventEmitter<boolean> = new EventEmitter();
  public static emitToggleStates   : EventEmitter<boolean> = new EventEmitter();
  public static emitTogglePause    : EventEmitter<boolean> = new EventEmitter();

  public static sendWasmReady() : void
  {
    this.emitWasmReady.emit();
  }

  public static sendToggleControls(state : boolean) : void
  {
    this.emitToggleControls.emit(state);
  }

  public static sendToggleStates(state : boolean) : void
  {
    this.emitToggleStates.emit(state);
  }

  public static sendTogglePause(state : boolean) : void
  {
    this.emitTogglePause.emit(state);
  }
}
