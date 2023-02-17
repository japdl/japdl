import Config from "@/utils/handleConfig";
import { setupJapscandlListeners } from "@/utils/listeners/japscan";
import { app, BrowserWindow, protocol } from "electron";
import contextMenu from "electron-context-menu";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import yargs from "yargs";
import listenersHandler, { setupLogListener } from "./utils/listeners/handler";

const argv = yargs.option("debug", {
  alias: "d",
  boolean: true,
  default: false,
  describe: "Enable debug mode",
}).argv;

let ready = false;
setupLogListener("readyStatus", (event) => (event.returnValue = ready));
setupLogListener("debug", (event) => {
  event.returnValue = argv.debug;
});

const isDevelopment = process.env.NODE_ENV !== "production";

// if is in production mode, we don't need to print anything on the terminal
if (!argv.debug) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  console.log = () => {};
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

contextMenu({
  showInspectElement: argv.debug,
  showSearchWithGoogle: false,
  labels: {
    copy: "Copier",
    cut: "Couper",
    paste: "Coller",
  },
});

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 720,
    height: 500,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      webSecurity: false,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env
        .ELECTRON_NODE_INTEGRATION as unknown as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
    // hide window during initialization
    show: false,
    frame: false,
    icon: "./src/assets/logo/large.ico",
  });
  try {
    console.log("Loading config");
    const config = new Config();
    console.log("Config data:", config.getData());
    const { imageFormat, chromePath, outputDirectory } = config.getData();
    await listenersHandler(win, config, async () => {
      try {
        await setupJapscandlListeners(
          {
            imageFormat,
            chromePath,
            outputDirectory,
          },
          win
        );
        ready = true;
      } catch (e) {
        ready = false;
      }
    });
    console.log("App is ready:", ready);
  } catch (e) {
    console.error("Error in config:", e);
  }

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    console.log(process.env.WEBPACK_DEV_SERVER_URL);
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    //if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
    console.log("Done loading");
  }
  win.webContents.on("new-window", (event) => {
    // prevent new window on middle click
    event.preventDefault();
  });
  // show window after everything is set up
  console.log("Showing window");
  setTimeout(() => {
    win.show();
  }, 1000);
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
