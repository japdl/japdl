import { MangaAttributes } from "japscandl/js/src/utils/types";

class MockDownloader {
  static async downloadChapter(
    mangaName: string,
    chapter: number,
    options?: {
      onPage: (attributes: MangaAttributes, totalPages: number) => void;
    }
  ): Promise<void> {
    const pages = 10 + Math.round(Math.random() * 5);
    for (let i = 1; i <= pages; i++) {
      setTimeout(
        () =>
          options?.onPage(
            {
              chapter: chapter.toString(),
              manga: mangaName,
              page: i.toString(),
            },
            pages
          ),
        i * 500
      );
    }
  }
}

export default MockDownloader;
