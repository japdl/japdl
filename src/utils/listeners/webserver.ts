import { BrowserWindow } from "electron";
import express from "express";
import fs from "fs/promises";
import { Server } from "http";
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

function applyGet(outputDirectory: string) {
  app.get("/", async (req, res) => {
    const htmlFile = new HtmlFile();
    const files = await fs.readdir(outputDirectory);
    files.forEach((file) => {
      htmlFile.addElement(`<a href="/${file}">${file}</a>`);
    });
    return res.status(200).send(htmlFile.finish());
  });

  app.get("/:path", async (req, res) => {
    const filename = req.params.path;
    //print ip adress of client
    console.log(req.ip, "is downloading file: " + filename);
    return res.download(path.join(outputDirectory, filename));
  });
}

export const PORT = 81818;

export const setupWebserver = (win: BrowserWindow, config: Config): void => {
  const configData = config.getData();
  applyGet(configData.outputDirectory);

  let server: Server;

  setupLogListener("switchServer", (event) => {
    if (!server) {
      server = app.listen(PORT, () => {
        console.log("listening on port " + PORT);
      });
    } else {
      server.close(() => {
        console.log("Server closed");
      });
    }
  });
};
