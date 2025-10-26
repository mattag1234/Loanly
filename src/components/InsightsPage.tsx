import { Card } from "./ui/card";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";

export function InsightsPage() {
  const insights = [
    {
      type: "positive",
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Strong Payment History",
      description: "You've maintained a perfect payment record for the last 18 months. This significantly boosts your credibility score.",
      impact: "+12 points"
    },
    {
      type: "positive",
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Improving Income Stability",
      description: "Your income has shown consistent growth over the past year, indicating strong financial health.",
      impact: "+8 points"
    },
    {
      type: "warning",
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Elevated Debt-to-Income Ratio",
      description: "Your current debt obligations are slightly higher than optimal. Consider paying down some debt to improve your score.",
      impact: "-5 points"
    },
    {
      type: "neutral",
      icon: <TrendingDown className="w-6 h-6" />,
      title: "Average Employment Tenure",
      description: "While your employment is stable, staying with your current employer longer can further improve your score.",
      impact: "Neutral"
    }
  ];

  const getCardStyle = (type: string) => {
    switch (type) {
      case "positive":
        return "border-l-4 border-l-[#1ABC9C]";
      case "warning":
        return "border-l-4 border-l-[#F39C12]";
      default:
        return "border-l-4 border-l-gray-400";
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "positive":
        return "text-[#1ABC9C]";
      case "warning":
        return "text-[#F39C12]";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl text-gray-900 mb-2">Your Financial Insights</h1>
        <p className="text-xl text-gray-600">
          Understand what's impacting your Credibility Index.
        </p>
      </div>

      {/* Score Trend Card */}
      <Card className="p-8 mb-8 bg-gradient-to-br from-[#1ABC9C] to-[#16A085] text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl mb-2">Score Trend</h2>
            <p className="text-lg opacity-90">Your score has increased by 7 points this month</p>
          </div>
          <div className="text-right">
            <div className="text-5xl">+7</div>
            <div className="text-sm opacity-90 mt-1">vs last month</div>
          </div>
        </div>
      </Card>

      {/* Insights List */}
      <div className="space-y-6">
        <h2 className="text-2xl text-gray-800">Key Factors</h2>
        {insights.map((insight, index) => (
          <Card key={index} className={`p-6 ${getCardStyle(insight.type)}`}>
            <div className="flex gap-4">
              <div className={`flex-shrink-0 ${getIconColor(insight.type)}`}>
                {insight.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg text-gray-800">{insight.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    insight.type === "positive" 
                      ? "bg-[#1ABC9C]/10 text-[#1ABC9C]"
                      : insight.type === "warning"
                      ? "bg-[#F39C12]/10 text-[#F39C12]"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {insight.impact}
                  </span>
                </div>
                <p className="text-gray-600">{insight.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Action Items */}
      <Card className="mt-8 p-6 bg-[#F5F7FA]">
        <h3 className="text-lg text-gray-800 mb-4">Recommended Actions</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-[#1ABC9C] mt-1">→</span>
            <span className="text-gray-700">Pay down credit card balance by $500 to improve your debt-to-income ratio</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#1ABC9C] mt-1">→</span>
            <span className="text-gray-700">Continue making on-time payments to maintain your excellent payment history</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#1ABC9C] mt-1">→</span>
            <span className="text-gray-700">Set up automatic payments to avoid missing any due dates</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
