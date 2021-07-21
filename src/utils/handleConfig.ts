import fs from "fs";
import path from "path";
import { app, BrowserWindow, ipcMain } from "electron";
import japscandl from "japscandl";

export type configData = {
  [key: string]: string;
  theme: "dark" | "light";
  outputDirectory: string;
  chromePath: string;
  imageFormat: "png" | "jpg";
};

const constraints = {
  theme: ["dark", "light"],
  imageFormat: ["png", "jpg"],
};

class Config {
  private readonly folderPath: string;
  private readonly configFile: string;
  private data!: configData;
  private BASIC_CONFIG_DATA: configData = {
    theme: "dark",
    outputDirectory: path.join(app.getPath("documents"), "Japdl", "manga"),
    chromePath: japscandl.utils.chrome.getChromePath(),
    imageFormat: "png",
  };

  constructor() {
    this.folderPath = path.join(app.getPath("appData"), "Japdl");
    console.log("folderPath:", this.folderPath);
    this.configFile = path.join(this.folderPath, "config.json");
    japscandl.utils.fsplus.createPath(this.folderPath);
    console.log("configFile:", this.configFile);
    // parse JSON in file this.configFile if it exists
    // if not, create it with default data
    if (!fs.existsSync(this.configFile)) {
      this.setData(this.BASIC_CONFIG_DATA);
      this.save();
    } else {
      console.log("File does exists");
      const data = fs.readFileSync(this.configFile, "utf8");
      if (data) {
        this.setData(JSON.parse(data));
        // check if data is valid
        const wrongFields = this.detectDataProblems(this.data);
        Object.entries(wrongFields).forEach(([field, value]) => {
          console.log(`${field} is wrong: ${value}`);
          this.data[field] = this.BASIC_CONFIG_DATA[field];
        });
      } else {
        console.log("Config file is corrupted. Creating a fresh one.");
        // set data to default
        this.setData(this.BASIC_CONFIG_DATA);
        this.save();
      }
    }
  }
  detectDataProblems(data: configData): {
    theme?: string;
    outputDirectory?: string;
    chromePath?: string;
    imageFormat?: string;
  } {
    const wrongFields = {} as {
      theme?: string;
      outputDirectory?: string;
      chromePath?: string;
      imageFormat?: string;
    };
    if (!data.theme || !constraints.theme.includes(data.theme)) {
      wrongFields.theme = data.theme;
    }
    if (!data.outputDirectory) {
      wrongFields.outputDirectory = data.outputDirectory;
    }
    if (
      !data.chromePath ||
      !fs.existsSync(data.chromePath) ||
      !fs.lstatSync(data.chromePath).isFile()
    ) {
      wrongFields.chromePath = data.chromePath;
    }
    if (
      !data.imageFormat ||
      !constraints.imageFormat.includes(data.imageFormat)
    ) {
      wrongFields.imageFormat = data.imageFormat;
    }
    return wrongFields;
  }

  isDataValid(data: configData): boolean {
    // check if detectDataProblems returns empty object
    const wrongFields = this.detectDataProblems(data);
    return Object.keys(wrongFields).length === 0;
  }

  save(): void {
    fs.writeFileSync(this.configFile, JSON.stringify(this.data, null, 4));
  }

  getData(): configData {
    return this.data;
  }

  setData(data: {
    theme: "dark" | "light";
    outputDirectory: string;
    chromePath: string;
    imageFormat: "png" | "jpg";
  }): void {
    this.data = data;
  }

  setupListeners(win: BrowserWindow): void {
    ipcMain.on("getConfigData", (event) => {
      event.reply("returnConfigData", this.data);
      console.log("Sending to renderer:", this.data);
    });
    ipcMain.on("getConfigDataSync", (event) => {
      event.returnValue = this.data;
    });
    ipcMain.on("getPossibleOptions", (event) => {
      event.reply("returnPossibleOptions", constraints);
    });
    ipcMain.on("setData", (event, arg) => {
      console.log("Receiving setData", arg);
      // if changing theme, we need to send changeTheme to the app
      if (this.data.theme !== arg.theme) {
        win.webContents.send("changeTheme", arg.theme);
      }
      const wrongFields = this.detectDataProblems(arg);
      const valid = Object.keys(wrongFields).length === 0;
      if (valid) {
        this.setData(arg);
        console.log("setting data");
        this.save();
        event.reply("dataSet", "ok");
      } else {
        console.log("Data is not valid");
        event.reply("dataSet", wrongFields);
      }
    });

    ipcMain.on("getTheme", (event) => {
      event.reply("changeTheme", this.data.theme);
    });
  }
}

export default Config;
