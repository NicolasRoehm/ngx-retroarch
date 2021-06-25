// Angular modules
import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';

// External modules
import { ComponentsModule } from 'components';

// Components
import { AppComponent }     from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ComponentsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
