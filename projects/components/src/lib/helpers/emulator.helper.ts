// Angular modules
import { Injectable } from '@angular/core';

// Enums
import { FsPath }     from '../enums/fs-path.enum';

// NOTE Retroarch variables
declare const FS : any;

// @dynamic
@Injectable()
export class EmulatorHelper
{
  // public static fromUint8ToString() : void
  // {
  //   var cfg = FS.readFile('/home/web_user/retroarch/userdata/retroarch.cfg');
  //   const decoder = new TextDecoder('utf-8'); decoder.decode(cfg);
  //   FS.analyzePath('/home/web_user/retroarch/userdata/');
  // }

  public static async readAsyncFile(filePath : string) : Promise<Uint8Array>
  {
    return new Promise((resolve) =>
    {
      let prevSizeInMB = 0;
      const interval = setInterval(async _ =>
      {
        const file = FS.readFile(filePath) as Uint8Array;
        if (!file)
          return;
        const curSizeInMB = file.length / 1_000_000;
        if (curSizeInMB !== prevSizeInMB || curSizeInMB === 0)
        {
          prevSizeInMB = curSizeInMB;
          return;
        }
        clearInterval(interval);
        return resolve(file);
      }, 500);
    });
  }

  public static async getScreenshot() : Promise<string>
  {
    const prevPath : any    = FS.analyzePath(FsPath.SCREENSHOT);
    let prevLength : number = Object.keys(prevPath.object.contents).length;

    // NOTE Take screenshot
    window['Module']._cmd_take_screenshot();

    return new Promise((resolve) =>
    {
      const interval = setInterval(async _ =>
      {
        const curPath   : any      = FS.analyzePath(FsPath.SCREENSHOT);
        const curKeys   : string[] = Object.keys(curPath.object.contents);
        const curLength : number   = curKeys.length;

        if (curLength !== prevLength || prevLength === 0)
        {
          prevLength = curLength;
          return;
        }

        clearInterval(interval);

        const data : Uint8Array = curPath.object.contents[curKeys[curKeys.length-1]].contents;

        const base64url : string = await new Promise(resolve =>
        {
          const reader  = new FileReader();
          reader.onload = _ => resolve(reader.result as string);
          reader.readAsDataURL(new Blob([data]));
        });
        const b64 = base64url.split(',', 2)[1];

        return resolve('data:image/png;base64, ' + b64);
      }, 200);
    });
  }
}
