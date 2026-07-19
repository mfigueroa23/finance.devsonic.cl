import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import type { AccountComparisonPoint } from '../hooks/useStatistics'
import { formatCurrency } from '../lib/format'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from './ui/chart'

const chartConfig = {
  ingresos: {
    label: 'Ingresos',
    color: 'var(--color-income)',
  },
  gastos: {
    label: 'Gastos',
    color: 'var(--color-expense)',
  },
} satisfies ChartConfig

interface StatisticsAccountChartProps {
  data: AccountComparisonPoint[]
}

export function StatisticsAccountChart({ data }: StatisticsAccountChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos y gastos por cuenta</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin datos para el período seleccionado.</p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
            <BarChart data={data} margin={{ top: 20 }} barGap={2}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="account" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => {
                      const seriesKey = name as keyof typeof chartConfig
                      const series = chartConfig[seriesKey]
                      return (
                        <div className="flex flex-1 items-center justify-between gap-3 leading-none">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <span
                              className="h-2 w-2 shrink-0 rounded-[2px]"
                              style={{ backgroundColor: series?.color }}
                            />
                            {series?.label ?? name}
                          </span>
                          <span className="font-mono font-medium tabular-nums text-foreground">
                            {formatCurrency(value as number)}
                          </span>
                        </div>
                      )
                    }}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="ingresos" fill="var(--color-ingresos)" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="gastos" fill="var(--color-gastos)" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
