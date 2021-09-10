// Angular modules
import { CommonModule }            from '@angular/common';
import { NgModule }                from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// External modules
import { TranslateModule }         from '@ngx-translate/core';

// Components
import { ControlsComponent }       from './components/controls/controls.component';
import { StatesComponent }         from './components/states/states.component';
import { EmulatorComponent }       from './components/emulator/emulator.component';
import { HudComponent }            from './components/hud/hud.component';
import { LoadingBarsComponent }    from './components/loading-bars/loading-bars.component';
import { PlayBtnComponent }        from './components/play-btn/play-btn.component';

export const translateModule = TranslateModule.forRoot();

@NgModule({
  declarations    : [ EmulatorComponent, HudComponent, ControlsComponent, StatesComponent, LoadingBarsComponent, PlayBtnComponent ],
  imports         : [
    // Angular modules
    CommonModule,
    BrowserAnimationsModule,

    // External modules
    translateModule,
  ],
  exports         : [ EmulatorComponent ],
})
export class ComponentsModule { }
