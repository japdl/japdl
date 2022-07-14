import { BrowserWindow } from "electron";
import express, { NextFunction } from "express";
import fs from "fs/promises";
import path from "path";
import Config from "../handleConfig";
import { setupLogListener } from "./handler";

class HtmlFile {
  private PAGE = `<!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Manga Download</title>
    </head>
    <body>
      $
    </body>
    </html>`;
  private elements: string[];
  private finished: boolean;
  constructor() {
    this.finished = false;
    this.elements = [];
  }

  addElement(element: string): void {
    this.elements.push(`${element}`);
  }

  finish(): string {
    if (!this.finished) {
      this.finished = true;
    }
    const allElements = this.elements.join("<br><br>\n");
    return this.PAGE.replace("$", allElements);
  }
}

const app = express();
let activated = false;

function accessMiddleware(
  request: express.Request,
  response: express.Response,
  next: NextFunction
) {
  if (activated) next();
  else response.sendStatus(403);
}

app.use(accessMiddleware);

function applyGet(outputDirectory: string) {
  async function displayDirectory(_path: string) {
    const htmlFile = new HtmlFile();
    const files = await fs.readdir(_path);
    files.forEach((file) => {
      const join = path.join(_path, file);
      const complete = join.replace(outputDirectory, "");
      htmlFile.addElement(`<a href="${complete}">${file}</a>`);
    });
    return htmlFile.finish();
  }

  app.get("/", async (req, res) => {
    const htmlString = await displayDirectory(outputDirectory);
    return res.status(200).send(htmlString);
  });

  app.get("/:path", async (req, res) => {
    const filename = req.params.path;
    if (filename === "favicon.ico") return;
    console.log(">>>>>> path", req.params.path);
    const fileChoosen = path.join(outputDirectory, filename);
    try {
      if ((await fs.lstat(fileChoosen)).isDirectory()) {
        return res.status(200).send(await displayDirectory(fileChoosen));
      } else {
        console.log(req.ip, "is downloading file: " + filename);
        return res.download(fileChoosen);
      }
    } catch (e) {
      console.log(e, fileChoosen);
    }
  });
  app.get("/:path/:file", async (req, res) => {
    const filename = path.join(req.params.path, req.params.file);
    if (req.params.file === "favicon.ico") return;
    const fileChoosen = path.join(outputDirectory, filename);
    try {
      if ((await fs.lstat(fileChoosen)).isDirectory()) {
        return res.status(200).send(await displayDirectory(fileChoosen));
      } else {
        console.log(req.ip, "is downloading file: " + filename);
        return res.download(fileChoosen);
      }
    } catch (e) {
      console.log(e, fileChoosen);
    }
  });
}

export const PORT = 8181;

export const setupWebserver = (win: BrowserWindow, config: Config): void => {
  const configData = config.getData();
  applyGet(configData.outputDirectory);

  const server = app.listen(PORT, () => {
    console.log("listening on port " + PORT);
  });

  setupLogListener("serverStatus", (event) => {
    event.returnValue = activated;
  });

  setupLogListener("switchServer", (event) => {
    event.returnValue = activated = !activated;
  });
};
