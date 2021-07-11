// Angular modules
import { Component }            from '@angular/core';

// External modules
import { SimpleModalComponent } from 'ngx-simple-modal';

export interface ConfirmModel {
  title   : string;
  message : string;
}

@Component({
  selector    : 'ngx-controls',
  templateUrl : './controls.component.html',
  styleUrls   : ['./controls.component.scss']
})
export class ControlsComponent extends SimpleModalComponent<ConfirmModel, boolean> implements ConfirmModel
{
  title   : string;
  message : string;
  constructor() {
    super();
  }
  confirm() {
    // we set modal result as true on click on confirm button,
    // then we can get modal result from caller code
    this.result = true;
    this.close();
  }
}
