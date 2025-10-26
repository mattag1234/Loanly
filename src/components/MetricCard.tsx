import { Card } from "./ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { HelpCircle } from "lucide-react";
import { Progress } from "./ui/progress";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  tooltip?: string;
}

export function MetricCard({ icon, title, value, tooltip }: MetricCardProps) {
  const percentage = value * 100;

  const getColor = () => {
    if (value >= 0.7) return "#1ABC9C";
    if (value >= 0.4) return "#F39C12";
    return "#E74C3C";
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-[#1ABC9C]">{icon}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700">{title}</span>
              {tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl" style={{ color: getColor() }}>
          {value.toFixed(2)}
        </div>
        <div className="relative">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${percentage}%`,
                backgroundColor: getColor(),
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
