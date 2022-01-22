export type OngoingDownload = {
  fullname: string;
  current: number;
  total: number;
  chapter?: string;
  volume?: string;
  percent: number;
};
