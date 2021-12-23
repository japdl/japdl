import { app, BrowserWindow, dialog } from "electron";
import { setupLogListener } from "./handler";

export const setupListeners = (win: BrowserWindow): void => {
  setupLogListener("restart", () => {
    app.relaunch();
    app.quit();
  });

  setupLogListener("version", (event) => {
    event.reply("versionResponse", app.getVersion());
  });

  win.on("maximize", () => {
    console.log("Maximize event");
    win.webContents.send("windowResize", true);
  });

  win.on("unmaximize", () => {
    console.log("UNMaximize event");
    win.webContents.send("windowResize", false);
  });

  setupLogListener("minimizeWindow", () => win.minimize());
  setupLogListener(
    "windowStatus",
    (event) => (event.returnValue = win.isMaximized())
  );
  setupLogListener("maximizeWindow", () => win.maximize());

  setupLogListener("restoreWindow", () => win.restore());

  setupLogListener("closeWindow", () => win.close());

  setupLogListener("directory-question", async (event, data) => {
    const properties = ["openDirectory", "multiSelections"];
    if (!data) {
      // remove multiselections
      properties.pop();
    }
    const fileChooser = await dialog.showOpenDialog({
      properties: properties as (
        | "openFile"
        | "openDirectory"
        | "multiSelections"
        | "showHiddenFiles"
        | "createDirectory"
        | "promptToCreate"
        | "noResolveAliases"
        | "treatPackageAsDirectory"
        | "dontAddToRecent"
      )[],
    });
    event.returnValue = fileChooser.filePaths;
  });

  setupLogListener("file-question", async (event, data) => {
    const properties = ["openFile", "multiSelections"];
    if (!data) {
      // remove multiselections
      properties.pop();
    }
    const fileChooser = await dialog.showOpenDialog({
      properties: properties as (
        | "openFile"
        | "openDirectory"
        | "multiSelections"
        | "showHiddenFiles"
        | "createDirectory"
        | "promptToCreate"
        | "noResolveAliases"
        | "treatPackageAsDirectory"
        | "dontAddToRecent"
      )[],
    });
    event.returnValue = fileChooser.filePaths;
  });
};
