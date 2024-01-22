export type DownloadOptions = {
  compression: "cbz" | "";
  images: boolean;
  asOne?: boolean;
};

export type ConfigDownloadOptions = Omit<DownloadOptions, "asOne">;
