import { app, protocol, BrowserWindow, ipcMain, dialog, shell } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { Downloader } from "japscandl";
import fs from "fs";
import path from "path";

ipcMain.on("directory-question", async (event, data) => {
  const options: (
    | "openFile"
    | "openDirectory"
    | "multiSelections"
    | "showHiddenFiles"
    | "createDirectory"
    | "promptToCreate"
    | "noResolveAliases"
    | "treatPackageAsDirectory"
    | "dontAddToRecent"
  )[] = ["openFile", "openDirectory", "multiSelections"];
  if (!data) {
    // remove multiselections
    options.pop();
  }
  const fileChooser = await dialog.showOpenDialog({ properties: options });
  event.returnValue = fileChooser.filePaths;
});

const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1000,
    height: 750,
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
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    //if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
  Downloader.launch({
    flags: {
      visible: false,
    },
    chromePath:
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    onEvent: {
      onPage: (attributes, total) => {
        console.log(attributes, total);
        const progress = ((+attributes.page / total) * 100).toFixed(2);
        win.webContents.send("downloadUpdatePage", {
          attributes,
          total,
          progress,
        });
      },
      onChapter: (attributes, current, total) =>
        win.webContents.send("downloadUpdateChapter", {
          attributes,
          current,
          total,
        }),
      onVolume: (manga, current, total) =>
        win.webContents.send("downloadUpdateVolume", { manga, current, total }),
    },
  })
    .then((downloader) => {
      function removeDownloadLocations(
        locations: string | string[] | string[][]
      ): void {
        if (typeof locations === "string") {
          return fs.rmSync(locations, { force: true, recursive: true });
        } else {
          locations.forEach((location) => removeDownloadLocations(location));
        }
      }
      ipcMain.on("getMangaInfos", async (event, data) => {
        const stats = await downloader.fetchStats(data);
        event.reply("replyMangaInfos", stats);
      });
      ipcMain.on(
        "download",
        async (
          event,
          args: {
            type: "volume" | "chapter";
            manga: string;
            start: number;
            end?: number;
            compression: boolean;
            deleteAfter: boolean;
          }
        ) => {
          const { type, manga, start, end, compression, deleteAfter } = args;
          console.log("Starting...", args);
          let downloadLocation = null;
          if (type === "volume") {
            if (end) {
              downloadLocation = await downloader.downloadVolumes(
                manga,
                start,
                end,
                compression
              );
            } else {
              downloadLocation = await downloader.downloadVolume(
                manga,
                start,
                compression
              );
            }
          } /* chapter */ else {
            if (end) {
              downloadLocation = await downloader.downloadChapters(
                manga,
                start,
                end,
                compression
              );
            } else {
              downloadLocation = await downloader.downloadChapter(
                manga,
                start,
                compression
              );
            }
          }
          console.log("Done!");
          if (deleteAfter) removeDownloadLocations(downloadLocation);
          ipcMain.emit("downloadFinish", downloadLocation);
        }
      );

      ipcMain.on("openMangaFolder", (event, data) => {
        shell.openPath(
          path.resolve(path.join(downloader.outputDirectory, data))
        );
      });
    })
    .catch((error) => console.log("ERROR DURING PUPPETEER INIT:", error));
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
    } catch (e: any) {
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
