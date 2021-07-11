// Angular modules
import { NgModule }          from '@angular/core';
import { CommonModule }      from '@angular/common';

// External modules
import { SimpleModalModule } from 'ngx-simple-modal';

// Components
import { EmulatorComponent } from './components/emulator/emulator.component';
import { HudComponent }      from './components/hud/hud.component';
import { ControlsComponent } from './components/controls/controls.component';

@NgModule({
  declarations    : [ EmulatorComponent, HudComponent, ControlsComponent ],
  imports         : [ CommonModule, SimpleModalModule.forRoot(
    { container : 'retroarch-container' },
    {
      closeOnEscape         : true,
      closeOnClickOutside   : true,
      bodyClass             : '',
      wrapperDefaultClasses : 'modal fade-anim',
      wrapperClass          : 'in',
      draggableClass        : '',
      animationDuration     : 0,
      autoFocus             : true,
      draggable             : false,
    }
  )],
  exports         : [ EmulatorComponent ],
  entryComponents : [ ControlsComponent ],
})
export class ComponentsModule { }
