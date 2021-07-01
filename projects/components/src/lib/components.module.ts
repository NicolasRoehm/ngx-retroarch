// Angular modules
import { NgModule }          from '@angular/core';
import { CommonModule }      from '@angular/common';

// Components
import { EmulatorComponent } from './components/emulator/emulator.component';
import { HudComponent }      from './components/hud/hud.component';

@NgModule({
  declarations : [ EmulatorComponent, HudComponent ],
  imports      : [ CommonModule ],
  exports      : [ EmulatorComponent ]
})
export class ComponentsModule { }
