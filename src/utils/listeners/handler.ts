import { BrowserWindow, ipcMain, IpcMainEvent } from "electron";
import Config from "../handleConfig";
import { setupListeners } from "./global";

const dev = process.env.NODE_ENV !== "production";

export function setupLogListener(
  eventName: string,
  callback: (event: IpcMainEvent, arg?: any) => void
): void {
  ipcMain.on(eventName, (event, arg) => {
    if (arg) {
      if (dev) process.stdout.write(`Received ${arg} for `);
    } else {
      if (dev) console.log(`event ${eventName}`);
    }
    callback(event, arg);
    if (dev) console.log(`event ${eventName} ended`);
  });
}

/**
 *  Applies all listeners. Can throw Error if listeners fail (mostly from japscandl)
 * @param win window to apply listeners on
 */
const setupAllListeners = (
  win: BrowserWindow,
  config: Config,
  japscanInitiator: () => Promise<void>
): Promise<void> => {
  return new Promise((resolve, reject) => {
    setupListeners(win);
    config.setupListeners(win);
    japscanInitiator()
      .then(() => {
        win.webContents.send("ready");
        resolve();
      })
      .catch((error) => reject(error));
  });
};

export default setupAllListeners;
