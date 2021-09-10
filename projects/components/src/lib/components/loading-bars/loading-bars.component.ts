// Angular modules
import { Component }         from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector      : 'ngx-loading-bars',
  templateUrl   : './loading-bars.component.html',
  styleUrls     : ['./loading-bars.component.scss'],
  encapsulation : ViewEncapsulation.ShadowDom
})
export class LoadingBarsComponent
{
  constructor() {}
}