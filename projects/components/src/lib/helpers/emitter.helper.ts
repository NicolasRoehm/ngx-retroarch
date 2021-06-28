// Angular modules
import { Injectable }   from '@angular/core';
import { EventEmitter } from '@angular/core';

@Injectable()
export class EmitterHelper
{
  public static emitWasmReady   : EventEmitter<void> = new EventEmitter();

  public static sendWasmReady() : void
  {
    this.emitWasmReady.emit();
  }
}
