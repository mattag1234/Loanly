import React from "react";
import { CredibilityGauge } from "./CredibilityGauge";
import { MetricCard } from "./MetricCard";
import { LoanOfferCard } from "./LoanOfferCard";
import { Card } from "./ui/card";
import { TooltipProvider } from "./ui/tooltip";
import { useUser } from "../contexts/UserContext";
import {
  TrendingUp,
  Briefcase,
  PieChart,
  CreditCard,
  Activity
} from "lucide-react";

export function DashboardPage() {
  const { profile, loanApplication } = useUser();
  const userName = `${profile.firstName} ${profile.lastName}`;
  const credibilityScore = loanApplication?.credibilityIndex || 82;

  const metrics = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Income Stability",
      value: 0.87,
      tooltip: "Measures the consistency and predictability of your income over time."
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Employment Tenure",
      value: 0.72,
      tooltip: "Reflects how long you've been with your current employer, showing job stability."
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Debt-to-Income Ratio",
      value: 0.65,
      tooltip: "The percentage of your monthly income that goes toward debt payments."
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Payment History",
      value: 0.93,
      tooltip: "Your track record of making on-time payments on existing obligations."
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Financial Behavior",
      value: 0.80,
      tooltip: "Overall financial habits including savings, spending patterns, and account management."
    }
  ];

  return (
    <TooltipProvider>
    <div>
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl text-gray-900 mb-2">
          Welcome back, {userName}
        </h1>
        <p className="text-xl text-gray-600">
          Your Credibility Index at a glance.
        </p>
      </div>

      {/* Center Card - Credibility Index */}
      <Card className="p-12 mb-12 bg-white shadow-lg">
        <h2 className="text-2xl text-center text-gray-800 mb-8">
          Credibility Index
        </h2>
        <CredibilityGauge score={credibilityScore} />
      </Card>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Metrics */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl text-gray-800 mb-6">Your Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics.map((metric, index) => (
              <MetricCard
                key={index}
                icon={metric.icon}
                title={metric.title}
                value={metric.value}
                tooltip={metric.tooltip}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Loan Offer */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl text-gray-800 mb-6">Loan Offer</h2>
          <LoanOfferCard />

          {/* Future Goals Section */}
          <Card className="mt-6 p-6">
            <h3 className="text-lg text-gray-800 mb-4">How to Improve Your CI</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Maintain consistent income sources</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Reduce overall debt obligations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Always pay bills on time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Build emergency savings</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
}
