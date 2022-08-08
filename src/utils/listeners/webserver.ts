import { BrowserWindow } from "electron";
import express, { NextFunction } from "express";
import fs from "fs";
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
    <ul>
      $
    </ul>
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
    const allElements = this.elements.join("<br>\n");
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
  else response.status(403).send("Le transfert est désactivé");
}

app.use(accessMiddleware);

function applyGet(outputDirectory: string) {
  function displayDirectory(_path: string) {
    const htmlFile = new HtmlFile();
    const files = fs.readdirSync(_path);
    // this is used to sort by alphanumerical order instead of the random javascript order
    files.sort(
      new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: "base",
      }).compare
    );
    files.forEach((file) => {
      const join = path.join(_path, file);
      const complete = join.replace(outputDirectory, "");
      if (fs.lstatSync(join).isDirectory()) {
        file += "/";
      }
      htmlFile.addElement(`<li><a href="${complete}">${file}</a></li>`);
    });
    return htmlFile.finish();
  }

  app.get("/", (req, res) => {
    const htmlString = displayDirectory(outputDirectory);
    return res.status(200).send(htmlString);
  });

  function handleFileRequest(
    //@ts-expect-error express type
    req: Request<any, any, QueryString.ParsedQs, Record<string, any>>,
    //@ts-expect-error express type
    res: Response<any, Record<string, any>, number>,
    filename: string
  ) {
    try {
      if (fs.lstatSync(filename).isDirectory()) {
        return res.status(200).send(displayDirectory(filename));
      } else {
        console.log(req.ip, "is downloading file: " + filename);
        return res.download(filename);
      }
    } catch (e) {
      console.log(e, filename);
    }
  }

  app.get("/:path", (req, res) => {
    const filename = req.params.path;
    if (filename === "favicon.ico") return;
    const fileChoosen = path.join(outputDirectory, filename);
    handleFileRequest(req, res, fileChoosen);
  });
  app.get("/:path/:file", (req, res) => {
    const filename = path.join(req.params.path, req.params.file);
    if (req.params.file === "favicon.ico") return;
    const fileChoosen = path.join(outputDirectory, filename);
    handleFileRequest(req, res, fileChoosen);
  });
  app.get("/:path/:directory/:file", (req, res) => {
    const filename = path.join(
      req.params.path,
      req.params.directory,
      req.params.file
    );
    if (req.params.file === "favicon.ico") return;
    const fileChoosen = path.join(outputDirectory, filename);
    handleFileRequest(req, res, fileChoosen);
  });
}

export const PORT = 8181;

export const setupWebserver = (win: BrowserWindow, config: Config): void => {
  const configData = config.getData();
  applyGet(configData.outputDirectory);

  app.listen(PORT, () => {
    console.log("listening on port " + PORT);
  });

  setupLogListener("serverStatus", (event) => {
    event.returnValue = activated;
  });

  setupLogListener("switchServer", (event) => {
    event.returnValue = activated = !activated;
  });
};
