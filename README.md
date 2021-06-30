# NgxRetroarch

**TODO**
- Update player key binding
- Update volume
- Full screen
- Save and load game state
- Save screenshot
- *Rename web component*

***
## Usage

The project isn't stable enough. It will be available on NPM as a web component.

***

## Demo

1. Build and serve the project
```sh
npm run demo
```
2. Navigate to `http://127.0.0.1:4300/`.

***

## Development

1. Install code and dependencies
```sh
git clone https://github.com/NicolasRoehm/ngx-retroarch
cd ./ngx-retroarch
npm i
```
2. Build the library in watch mode
```sh
npm run watch:all
```
3. Start the dev server in a new terminal
```sh
npm run start
```
4. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

***

## Build

```sh
npm run build:all
```
The build artifacts will be stored in the `dist/elements` directory.
/!\ There is no ROM included and the index.html

***

## Thanks

- [Angular Elements: Create a Component Library for Angular and the Web](https://notiz.dev/blog/create-a-component-library-for-angular-and-the-web)
- [Angular library and live reload](https://stackoverflow.com/a/59706221/7462178)
- [BinBashBanana/webretro](https://github.com/BinBashBanana/webretro)
