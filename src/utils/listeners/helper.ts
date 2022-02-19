import { BrowserWindow } from "electron";
import { IpcMainEvent } from "electron/main";

export const getWindowFromEvent = (
  event: IpcMainEvent
): BrowserWindow | null => {
  return BrowserWindow.fromWebContents(event.sender);
};
