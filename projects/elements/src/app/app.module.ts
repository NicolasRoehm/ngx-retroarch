// Angular modules
import { NgModule }            from '@angular/core';
import { Injector }            from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule }       from '@angular/platform-browser';

// Components
import { ComponentsModule }    from 'components';
import { ComponentsComponent } from 'components';

@NgModule({
  imports: [
    BrowserModule,
    ComponentsModule
  ],
  providers: []
})
export class AppModule {

  constructor(private injector: Injector){}

  ngDoBootstrap()
  {
    const element = createCustomElement(ComponentsComponent, { injector: this.injector })
    customElements.define('lib-components', element);
  }

}
