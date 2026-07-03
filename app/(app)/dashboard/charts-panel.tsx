"use client";

import { useTheme } from "next-themes";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { FlexStatusChartRow, RecSourceChartRow } from "@/lib/charts/buildChartData";

const COLOR_OFFER = "#059669";
const COLOR_NEED = "#0284c7";
const COLOR_REC = "#d97706";

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
    <div className="section-card">
      <h3 className="text-sm font-medium text-primary">{title}</h3>
      {isEmpty ? (
        <p className="mt-8 text-center text-sm text-muted">
          Pas encore de données pour afficher un graphique.
        </p>
      ) : (
        <div className="mt-3 h-64 min-h-64 w-full">{children}</div>
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
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const axisTick = { fontSize: 12, fill: isDark ? "#d4d4d4" : "#52525b" };
  const gridStroke = isDark ? "#404040" : "#e4e4e7";
  const labelFill = isDark ? "#e5e5e5" : "#3f3f46";
  const legendColor = isDark ? "#e5e5e5" : "#52525b";
  const hideZeroLabel = (value: unknown) =>
    typeof value === "number" && value > 0 ? value : "";

  const hasFlexData = flexStatusData.some((row) => row.offer + row.need > 0);
  const hasRecData = recSourceData.length > 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ChartCard
        title="Créneaux flex par statut"
        isEmpty={!hasFlexData}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 480, height: 256 }}
        >
          <BarChart data={flexStatusData} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis dataKey="statusLabel" tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} width={32} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8, color: legendColor }} />
            <Bar
              dataKey="offer"
              name="Offre"
              fill={COLOR_OFFER}
              radius={[4, 4, 0, 0]}
              isAnimationActive
              animationDuration={450}
            >
              <LabelList
                dataKey="offer"
                position="top"
                fill={labelFill}
                fontSize={11}
                formatter={hideZeroLabel}
              />
            </Bar>
            <Bar
              dataKey="need"
              name="Besoin"
              fill={COLOR_NEED}
              radius={[4, 4, 0, 0]}
              isAnimationActive
              animationDuration={450}
            >
              <LabelList
                dataKey="need"
                position="top"
                fill={labelFill}
                fontSize={11}
                formatter={hideZeroLabel}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Volume REC par source (MWh)"
        isEmpty={!hasRecData}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 480, height: 256 }}
        >
          <BarChart data={recSourceData} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis dataKey="source" tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} width={32} />
            <Bar
              dataKey="quantityMwh"
              name="MWh"
              fill={COLOR_REC}
              radius={[4, 4, 0, 0]}
              isAnimationActive
              animationDuration={450}
            >
              <LabelList
                dataKey="quantityMwh"
                position="top"
                fill={labelFill}
                fontSize={11}
                formatter={hideZeroLabel}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
