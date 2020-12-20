# Soldat Launcher

Launcher for Soldat game, a replacement for the old GUI that was removed with Soldat 1.8.

It's an Electron app, written in Typescript with [React](https://reactjs.org/) and [MobX](https://mobx.js.org).

## Installation and usage

To run the app, you will need [Node.js](https://nodejs.org).

To install dependencies, run this command from project's root directory:
```sh
npm install
```

Afterwards, you can run following commands:
```sh
# Starts the app in development mode.
npm start

# Builds binaries. The output will be in out/ directory.
npm run make

# Runs tests.
npm run test

# Runs ESLint.
npm run lint
```

This project is meant to be used together with Soldat binaries. By default, the launcher will expect to find a directory called "soldat" at the root of this project. It should contain all files that Soldat needs to operate (binaries for both server and client, dynamic libraries, soldat.smod file and font for the client). When making a release build (with ```npm run make```), this "soldat" directory will be copied to Electron's resources folder. If you want, you can customize the path to Soldat by editing src/api/soldat/paths.ts file.

When running the app with ```npm start```, you can type ```rs``` in the same terminal to quickly restart it.

## License
The launcher is licensed under [MIT](./LICENSE) license.

Files in the "assets" directory were taken from [Soldat's base repository](https://github.com/Soldat/base) and are licensed under [CC BY 4.0](https://github.com/Soldat/base/blob/master/LICENSE.md). Their original author is Michał Marcinkowski. No changes were made to the files.

## Support me
If you like this project and would like to support me, please consider donating. You can do so with [PayPal](https://paypal.me/janrozanski).