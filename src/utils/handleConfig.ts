import fs from "fs";
import path from "path";
import { app, BrowserWindow } from "electron";
import japscandl from "../../japscandl/js";
import { setupLogListener } from "./listeners/handler";

export type configData = {
  [key: string]: string | boolean;
  theme: "dark" | "light";
  outputDirectory: string;
  chromePath: string;
  fast: boolean;
  selector: string;
};

const constraints = {
  theme: ["dark", "light"],
};

class Config {
  private readonly folderPath: string;
  private readonly configFile: string;
  private data!: configData;
  private BASIC_CONFIG_DATA: configData = {
    theme: "dark",
    outputDirectory: path.join(app.getPath("documents"), "Japdl", "manga"),
    chromePath: (() => {
      try {
        return japscandl.utils.chrome.getChromePath();
      } catch (e) {
        return "";
      }
    })(),
    fast: true,
    selector: "",
  };

  constructor() {
    this.folderPath = path.join(app.getPath("appData"), "Japdl");
    this.configFile = path.join(this.folderPath, "config.json");
    japscandl.utils.fsplus.createPath(this.folderPath);
    console.log("folderPath:", this.folderPath);
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
        this.save();
      } else {
        console.error("Config file is corrupted. Creating a fresh one.");
        // set data to default
        this.setData(this.BASIC_CONFIG_DATA);
        this.save();
      }
      console.log("Output directory:", this.data.outputDirectory);
    }
  }
  detectDataProblems(data: configData): {
    theme?: string;
    outputDirectory?: string;
    chromePath?: string;
    fast?: boolean;
  } {
    const wrongFields = {} as {
      theme?: string;
      outputDirectory?: string;
      chromePath?: string;
      fast?: boolean;
    };
    if (!data.theme || !constraints.theme.includes(data.theme)) {
      wrongFields.theme = data.theme;
    }
    if (!data.outputDirectory) {
      wrongFields.outputDirectory = data.outputDirectory;
    }

    if (typeof data.fast !== "boolean") {
      wrongFields.fast = data.fast;
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

  setData(data: configData): void {
    this.data = data;
  }

  setField(fieldName: string, value: string): void {
    this.data[fieldName] = value;
    this.save();
  }

  setupListeners(win: BrowserWindow): void {
    setupLogListener("getConfigData", (event) => {
      event.reply("returnConfigData", this.data);
      console.log("Sending to renderer:", this.data);
    });
    setupLogListener("getConfigDataSync", (event) => {
      event.returnValue = this.data;
    });
    setupLogListener("getDefaultDataSync", (event) => {
      event.returnValue = this.BASIC_CONFIG_DATA;
    });
    setupLogListener("getPossibleOptions", (event) => {
      event.reply("returnPossibleOptions", constraints);
    });
    setupLogListener("setData", (event, arg) => {
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

    setupLogListener("setTheme", (event, arg) => {
      this.setField("theme", arg);
      win.webContents.send("changeTheme", arg);
    });

    setupLogListener("setDataSync", (event, arg) => {
      console.log("Receiving setDataSync", arg);
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
        event.returnValue = "ok";
      } else {
        console.log("Data is not valid");
        event.returnValue = wrongFields;
      }
    });

    setupLogListener("getTheme", (event) => {
      event.reply("changeTheme", this.data.theme);
    });

    setupLogListener("setField", (event, arg) => {
      this.setField(arg[0], arg[1]);
    });
  }
}

export default Config;
