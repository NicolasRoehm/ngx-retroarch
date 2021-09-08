// Angular modules
import { NgModule }            from '@angular/core';
import { Injector }            from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule }       from '@angular/platform-browser';

// Components
import { ComponentsModule }    from 'components';
import { EmulatorComponent }   from 'components';

@NgModule({
  imports: [
    BrowserModule,
    ComponentsModule
  ],
})
export class AppModule {

  constructor(private injector: Injector){}

  ngDoBootstrap()
  {
    const element = createCustomElement(EmulatorComponent, { injector : this.injector });
    customElements.define('ngx-retroarch', element);
  }

}
