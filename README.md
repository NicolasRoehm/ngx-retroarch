# NgxRetroarch

RetroArch as a web component.

## Roadmap
- Update player key binding + check if there is the same "wasmTable.get(108)()" function in all unminified cores
- Save & load game state
- Save & download saved screenshot
- Auto detect core
- Add cores + check if there is the same "queueAudio" function in all unminified cores
- Speed / Slow
- Show FPS
- About project
- Update usage chapter (readme)
- Disable retroarch on dev mode

## Usage

The project isn't stable enough. It will be available on NPM as a web component.

```html
<ngx-retroarch core="snes9x" rom="Goof_Troop.zip"></ngx-retroarch>
```

The following attributes can be set on ngx-retroarch:

- **rom** - The rom file name with its extension. For example: `Goof_Troop.zip`.
- **rom-path** - The path to the rom (default is `./`). You have to define the path to the rom without the rom file. For example: `https://www.example.com/assets/snes/`
- **core-path** - The path to the core (default is `./`). Cores are included into the NPM package so you don't have to update the path unless you want to import them by yourself.
- **core** - Choose one the following:

|       Core       |   Console    |
| ---------------- | ------------ |
| mgba             | GBA          |
| dolphin          | GC/Wii       |
| citra            | Nintendo 3DS |
| desmume          | Nintendo DS  |
| mupen64plus_next | Nintendo 64  |
| parallel_n64     | Nintendo 64  |
| snes9x           | SNES         |
| nestopia         | NES          |
| ppsspp           | PSP          |
| beetle_psx       | PS1          |
| genesis_plus_gx  | Genesis      |
### NPM

```sh
// Not available yet
npm install @nicolasroehm/ngx-retroarch
```

### CDN

## Source code

1. Download code and install dependencies
```sh
git clone https://github.com/NicolasRoehm/ngx-retroarch
cd ./ngx-retroarch
npm install
```
2. Add your rom(s) in the `src/assets/roms` directory

### Demo

3. Edit the `rom` and `core` attributes in `src/assets/demo.html`
4. Build and serve the project
```sh
npm run demo
```
5. Navigate to http://127.0.0.1:4300/.

### Development

3. Edit the `rom` and `core` attributes in `src/app/app.component.html`

4. Build the library in watch mode
```sh
npm run watch:all
```
5. Once the library is watched, start the dev server in a new terminal
```sh
npm run start
```
6. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

### Architecture

| File | Purpose |
| --- | --- |
| [emulator.component.ts](https://github.com/NicolasRoehm/ngx-retroarch/blob/master/projects/components/src/lib/components/emulator/emulator.component.ts) [emulator.component.html](https://github.com/NicolasRoehm/ngx-retroarch/blob/master/projects/components/src/lib/components/emulator/emulator.component.html) | This contains the main logic of the package. |
| [app.component.html](https://github.com/NicolasRoehm/ngx-retroarch/blob/master/src/app/app.component.html) | This contains the development code which uses the package as an Angular component. |
| [demo.html](https://github.com/NicolasRoehm/ngx-retroarch/blob/master/src/assets/demo.html) | This contains the final code which uses the package as a web component *(once built)*. This file is `cp` to `dist/elements/index.html` during the build process. |

### Build

```sh
npm run build:all
```
The build artifacts will be stored in the `dist/elements` directory.

❗There is no ROM included❗

## Thanks

- [Angular Elements : Create a Component Library for Angular and the Web](https://notiz.dev/blog/create-a-component-library-for-angular-and-the-web)
- [Angular library and live reload](https://stackoverflow.com/a/59706221/7462178)
- [BinBashBanana/webretro](https://github.com/BinBashBanana/webretro)
- [Deobfuscated version of NeptunJS/NeptuneJS/NJS](https://github.com/asifagaria/NeptunJS)
