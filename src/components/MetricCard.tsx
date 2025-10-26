import { Card } from "./ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useMemo } from "react";
import { getColorByPercentage } from "../utils/colors";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  tooltip?: string;
}

export function MetricCard({ icon, title, value, tooltip }: MetricCardProps) {
  const percentage = value * 100;

  // Memoize color calculation
  const color = useMemo(() => getColorByPercentage(percentage), [percentage]);

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-primary">{icon}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700">{title}</span>
              {tooltip && (
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-2xl" style={{ color }}>
          {value.toFixed(2)}
        </div>
        <div className="relative">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${percentage}%`,
                backgroundColor: color,
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
