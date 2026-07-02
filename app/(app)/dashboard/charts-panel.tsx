"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FlexStatusChartRow, RecSourceChartRow } from "@/lib/charts/buildChartData";

const COLOR_OFFER = "#059669"; // emerald-600
const COLOR_NEED = "#0284c7"; // sky-600
const COLOR_REC = "#d97706"; // amber-600

function ChartCard({
  title,
  isEmpty,
  children,
}: {
  title: string;
  isEmpty: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
      <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      {isEmpty ? (
        <p className="mt-8 text-center text-sm text-zinc-500">
          Pas encore de données pour afficher un graphique.
        </p>
      ) : (
        <div className="mt-3 h-64">{children}</div>
      )}
    </div>
  );
}

export function ChartsPanel({
  flexStatusData,
  recSourceData,
}: {
  flexStatusData: FlexStatusChartRow[];
  recSourceData: RecSourceChartRow[];
}) {
  const hasFlexData = flexStatusData.some((row) => row.offer + row.need > 0);
  const hasRecData = recSourceData.length > 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ChartCard title="Créneaux flex par statut" isEmpty={!hasFlexData}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={flexStatusData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
            <XAxis dataKey="statusLabel" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="offer" name="Offre" fill={COLOR_OFFER} radius={[4, 4, 0, 0]} />
            <Bar dataKey="need" name="Besoin" fill={COLOR_NEED} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Volume REC par source (MWh)" isEmpty={!hasRecData}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={recSourceData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
            <XAxis dataKey="source" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="quantityMwh" name="MWh" fill={COLOR_REC} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
