import { DownloadSetHandler } from "./DownloadSet";
import { OngoingDownload } from "./types";

const handleChapterDownload = async (
  downloadSet: DownloadSetHandler,
  manga: string,
  chapter: number,
  compression: boolean,
  deleteAfterCompression: boolean
): Promise<void> => {
  const { downloader } = downloadSet;
  const download: OngoingDownload = {
    fullname: `${manga} chapitre ${chapter}`,
    current: 0,
    total: 0,
    percent: 0,
  };
  downloadSet.setCurrentDownload(download);
  return downloader.downloadChapter(manga, chapter, {
    compression,
    deleteAfterCompression,
    callback: (events) => {
      events.on("start", (attributes, link, total) => {
        download.current = 0;
        download.total = total;
        download.percent = 0;
        downloadSet.setCurrentDownload(download);
      });
      /* events.on("noimage", (attributes, link) => {
        });
      }); */
      events.on("page", (attributes, total) => {
        download.current = +attributes.page;
        download.percent = (download.current / download.total) * 100;
        console.log(attributes, total);
        downloadSet.setCurrentDownload(download);
      });
      /* if (compression) {
        events.on("compressing", () => {
        });
        events.on("compressed", (attributes, path, stats) => {
        });
      } */
      events.on("done", () => {
        downloadSet.clearCurrentDownload();
      });
    },
  });
};

export default handleChapterDownload;
