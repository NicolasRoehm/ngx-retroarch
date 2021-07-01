// Angular modules
import { Component, ElementRef } from '@angular/core';
import { OnInit }    from '@angular/core';

declare const Browser : any;

@Component({
  selector    : 'ngx-hud',
  templateUrl : './hud.component.html',
  styleUrls   : ['./hud.component.scss']
})
export class HudComponent implements OnInit
{

  constructor
  (
    private elementRef : ElementRef
  )
  {

  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Init ----------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public async ngOnInit() : Promise<void>
  {

  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Actions -------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public onClickFullscreen() : void
  {
    // this.elementRef
    // console.log(this.elementRef.nativeElement.parentElement);
    // let el = document.getElementById('#retroarch-container');
    // console.log(el);
    // if (!el)
    //   return;
    this.elementRef.nativeElement.parentElement.requestFullscreen();
    // Browser.requestFullscreen(true, false);
  }

  // -------------------------------------------------------------------------------
  // ---- NOTE Helpers -------------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // ---- NOTE Subscription --------------------------------------------------------
  // -------------------------------------------------------------------------------

}
