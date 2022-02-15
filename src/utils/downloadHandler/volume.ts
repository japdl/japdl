import { DownloadSetHandler } from "./DownloadSet";

export type VolumeDownload = {
  manga: string;
  num: string;
  current: number;
  currentName: string;
  total: number;
  percent: number;
  type: "volume";
};

const handleVolumeDownload = async (
  downloadSet: DownloadSetHandler,
  manga: string,
  num: number,
  compression: boolean,
  deleteAfterCompression: boolean
): Promise<void> => {
  const { downloader } = downloadSet;
  const download: VolumeDownload = {
    manga: manga,
    num: num.toString(),
    currentName: "",
    current: 0,
    total: 0,
    percent: 0,
    type: "volume",
  };
  downloadSet.setCurrentDownload(download);
  await downloader.downloadVolume(manga, num, {
    compression,
    deleteAfterCompression,
    callback: (events) => {
      events.on("chapters", (chapters) => {
        download.total = chapters.length;
        downloadSet.setCurrentDownload(download);
      });

      events.on("startchapter", (attributes, pages, current, total) => {
        download.currentName = attributes.chapter;
        download.current = current;
        download.total = total;
        downloadSet.setCurrentDownload(download);
      });
      /* events.on("noimage", (attributes, link) => {
        });
      }); */
      events.on("page", (attributes, total) => {
        // eg: 2 chapitres, chacun 10 pages
        const chapterPortion = 100 / download.total;
        const pagePortion = chapterPortion / total;
        download.percent =
          chapterPortion * (download.current - 1) +
          pagePortion * +attributes.page;
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

export default handleVolumeDownload;
