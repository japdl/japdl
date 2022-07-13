import { app, BrowserWindow, dialog } from "electron";
import { downloadQueue } from "../downloadHandler";
import { setupLogListener } from "./handler";
import { getWindowFromEvent } from "./helper";
import express from "express";

export const setupListeners = (win: BrowserWindow): void => {
  setupLogListener("log");

  setupLogListener("restart", () => {
    app.relaunch();
    app.quit();
  });

  setupLogListener("version", (event) => {
    event.reply("versionResponse", app.getVersion());
  });

  setupLogListener("process", (event, key: string) => {
    // @ts-expect-error process can't be indexed by any string but caller will be careful
    event.returnValue = process[key];
  });

  win.on("maximize", () => {
    console.log("Maximize event");
    win.webContents.send("windowResize", true);
  });

  win.on("unmaximize", () => {
    console.log("Unmaximize event");
    win.webContents.send("windowResize", false);
  });

  setupLogListener("minimizeWindow", () => win.minimize());
  setupLogListener(
    "windowStatus",
    (event) => (event.returnValue = win.isMaximized())
  );

  setupLogListener("maximizeWindow", () => {
    win.maximize();
  });

  setupLogListener("restoreWindow", () => win.restore());

  setupLogListener("closeWindow", (event) => {
    async function askForClose() {
      const options = {
        title: "Quitter japdl",
        buttons: ["Oui", "Non", "Annuler"],
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        actions: [() => eventWindow?.close(), () => {}, () => {}],
        message:
          "Un téléchargement est en cours. Voulez-vous vraiment quitter ? Le téléchargement sera interrompu.",
      };
      const response = await dialog.showMessageBox(options);
      options.actions[response.response]();
    }
    const eventWindow = getWindowFromEvent(event);

    if (downloadQueue?.isDownloading()) {
      askForClose();
    } else {
      eventWindow?.close();
    }
  });

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

  setupLogListener("downloadChrome", () => {
    console.log("Downloading chrome is not implemented yet");
  });
};
