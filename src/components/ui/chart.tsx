"use client"

import { cn } from "@/lib/utils"

export type ChartConfig = Record<
  string,
  {
    label: string
    color: string
  }
>

export function ChartContainer({
  children,
  config,
  className,
}: {
  children: React.ReactNode
  config: ChartConfig
  className?: string
}) {
  const colors = Object.entries(config).reduce((acc, [key, val]) => {
    acc[`--color-${key}`] = val.color
    return acc
  }, {} as Record<string, string>)

  return (
    <div
      className={cn("w-full overflow-x-auto", className)}
      style={colors as React.CSSProperties}
    >
      {children}
    </div>
  )
}

export function ChartTooltip({
  cursor,
  content,
}: {
  cursor?: boolean
  content?: React.ReactElement
}) {
  return null // Use native recharts <Tooltip /> in your chart code
}

export function ChartTooltipContent({
  hideLabel = false,
}: {
  hideLabel?: boolean
}) {
  return (
    <div className="p-2 text-xs bg-background border rounded shadow-sm">
      <p>{hideLabel ? "" : "Tooltip content"}</p>
    </div>
  )
}
