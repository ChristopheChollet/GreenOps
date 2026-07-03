export type FlexKind = "offer" | "need";
export type FlexStatus = "draft" | "open" | "matched";

export type FlexSlotInput = {
  kind: FlexKind;
  status: FlexStatus;
  start_at: string;
  end_at: string;
  power_kw: number | null;
};

export type RecCertificateInput = {
  label: string;
  period_start: string;
  period_end: string;
  source: string | null;
  quantity_mwh: number | null;
};
