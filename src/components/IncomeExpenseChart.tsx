import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts'
import { useIncomeExpenseSummary } from '../hooks/useIncomeExpenseSummary'
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

function formatCompact(value: string | number | boolean | null | undefined) {
  const amount = Number(value)
  if (!amount) return ''

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount)
}

export function IncomeExpenseChart() {
  const { data, loading, error } = useIncomeExpenseSummary()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos vs. Gastos</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-sm text-muted-foreground">Cargando…</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {!loading && !error && (
          <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
            <BarChart data={data} margin={{ top: 20 }} barGap={2}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
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
              <Bar dataKey="ingresos" fill="var(--color-ingresos)" radius={[4, 4, 0, 0]} maxBarSize={24}>
                <LabelList
                  dataKey="ingresos"
                  position="top"
                  className="fill-muted-foreground"
                  fontSize={10}
                  formatter={formatCompact}
                />
              </Bar>
              <Bar dataKey="gastos" fill="var(--color-gastos)" radius={[4, 4, 0, 0]} maxBarSize={24}>
                <LabelList
                  dataKey="gastos"
                  position="top"
                  className="fill-muted-foreground"
                  fontSize={10}
                  formatter={formatCompact}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
