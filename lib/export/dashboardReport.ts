export type DashboardReportData = {
  orgName: string;
  generatedAt: Date;
  flexTotal: number;
  flexOpen: number;
  recTotal: number;
  totalMwh: number;
  flexRows: {
    kind: string;
    status: string;
    start_at: string;
    end_at: string;
    power_kw: number | null;
  }[];
  recRows: {
    label: string;
    period_start: string;
    period_end: string;
    source: string | null;
    quantity_mwh: number | null;
  }[];
};
