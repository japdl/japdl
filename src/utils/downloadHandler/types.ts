export type OngoingDownload = {
  manga: string;
  fullname: string;
  current: number;
  total: number;
  chapter?: string;
  volume?: string;
  percent: number;
};
