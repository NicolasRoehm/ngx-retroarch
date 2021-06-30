// Angular modules
import { NgModule }          from '@angular/core';
import { CommonModule }      from '@angular/common';

// Components
import { EmulatorComponent } from './components/emulator.component';

@NgModule({
  declarations : [ EmulatorComponent ],
  imports      : [ CommonModule ],
  exports      : [ EmulatorComponent ]
})
export class ComponentsModule { }
