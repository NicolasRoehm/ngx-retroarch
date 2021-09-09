// Angular modules
import { SafeResourceUrl } from '@angular/platform-browser';

export class GameState
{
  public id      : string     = null;
  public label   : string     = null;
  public img     : string     = null;
  public safeImg : SafeResourceUrl = null;

  public romName : string     = null;
  public date    : Date       = null;
  public state   : Uint8Array = null;

  constructor(index : number, romName : string, state : Uint8Array)
  {
    this.label   = `Save - n°${index}`;
    this.romName = romName;
    this.date    = new Date();
    this.id      = `${romName}_state_${this.getDateSuffix(this.date)}`;
    this.state   = state;
  }

  private getDateSuffix(date : Date) : string
  {
    const day     = date.getDate()        < 10 ? '0' + date.getDate()        : date.getDate();
    const month   = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    const hours   = date.getHours()       < 10 ? '0' + date.getHours()       : date.getHours();
    const minutes = date.getMinutes()     < 10 ? '0' + date.getMinutes()     : date.getMinutes();
    const seconds = date.getSeconds()     < 10 ? '0' + date.getSeconds()     : date.getSeconds();
    return `${date.getFullYear()}-${month}-${day}_${hours}:${minutes}:${seconds}`;
  }

}