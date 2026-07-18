import { useMemo } from 'react'
import { Cell, Label, Pie, PieChart } from 'recharts'
import { useExpensesByCategory } from '../hooks/useExpensesByCategory'
import { getCategoryColor } from '../lib/categoryColors'
import { formatCurrency } from '../lib/format'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart'

export function ExpensesByCategoryChart() {
  const { data, total, loading, error } = useExpensesByCategory()

  const chartConfig = useMemo(() => {
    return data.reduce<ChartConfig>((config, item, index) => {
      config[item.category] = { label: item.category, color: getCategoryColor(index) }
      return config
    }, {})
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por categoría</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-sm text-muted-foreground">Cargando…</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {!loading && !error && data.length === 0 && (
          <p className="text-sm text-muted-foreground">Sin gastos registrados este mes.</p>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <ChartContainer config={chartConfig} className="aspect-square h-[220px] w-[220px] shrink-0">
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value, name) => {
                        const series = chartConfig[name as string]
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
                <Pie data={data} dataKey="amount" nameKey="category" innerRadius={62} outerRadius={90} strokeWidth={2}>
                  {data.map((entry, index) => (
                    <Cell key={entry.category} fill={getCategoryColor(index)} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (!viewBox || !('cx' in viewBox) || viewBox.cx == null || viewBox.cy == null) return null
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-lg font-bold">
                            {formatCurrency(total)}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 18} className="fill-muted-foreground text-xs">
                            este mes
                          </tspan>
                        </text>
                      )
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>

            <ul className="flex w-full flex-col gap-2">
              {data.map((item, index) => (
                <li key={item.category} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 text-foreground">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                      style={{ backgroundColor: getCategoryColor(index) }}
                    />
                    {item.category}
                  </span>
                  <span className="font-mono text-muted-foreground tabular-nums">{item.percentage}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
