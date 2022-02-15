import { DownloadSetHandler } from "./DownloadSet";

export type ChapterDownload = {
  manga: string;
  num: string;
  current: number;
  total: number;
  percent: number;
  type: "chapter";
};

const handleChapterDownload = async (
  downloadSet: DownloadSetHandler,
  manga: string,
  chapter: number,
  compression: boolean,
  deleteAfterCompression: boolean
): Promise<void> => {
  const { downloader } = downloadSet;
  const download: ChapterDownload = {
    manga: manga,
    num: chapter.toString(),
    current: 0,
    total: 0,
    percent: 0,
    type: "chapter",
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
