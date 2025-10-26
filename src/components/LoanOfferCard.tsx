import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { DollarSign, TrendingDown } from "lucide-react";
import { useApplication } from "../contexts/ApplicationContext";

interface LoanOfferCardProps {
  onNavigate: () => void;
}

export function LoanOfferCard({ onNavigate }: LoanOfferCardProps) {
  const { application, metrics } = useApplication();

  // Calculate APR based on credibility score (inverse relationship)
  // Score 90-100: 3.5-5%
  // Score 80-89: 5-7%
  // Score 70-79: 7-9%
  // Score 60-69: 9-12%
  // Score <60: 12-18%
  const calculateAPR = (score: number): number => {
    if (score >= 90) return 3.5 + (100 - score) * 0.15;
    if (score >= 80) return 5.0 + (90 - score) * 0.20;
    if (score >= 70) return 7.0 + (80 - score) * 0.20;
    if (score >= 60) return 9.0 + (70 - score) * 0.30;
    return Math.min(12.0 + (60 - score) * 0.15, 18.0);
  };

  const credibilityScore = metrics?.credibilityScore || 82;
  const loanAmount = application?.loanAmount || 8000;
  const apr = calculateAPR(credibilityScore);

  // Format loan amount with commas
  const formattedAmount = loanAmount.toLocaleString('en-US');

  return (
    <Card className="p-6 bg-gradient-to-br from-[#1ABC9C] to-[#16A085] text-white">
      <h3 className="text-xl mb-4">Loan Offer Preview</h3>
      
      <div className="space-y-6">
        <div>
          <p className="text-sm opacity-90 mb-2">You may qualify for:</p>
          <div className="flex items-baseline gap-2">
            <DollarSign className="w-8 h-8" />
            <span className="text-4xl">{formattedAmount}</span>
          </div>
          <p className="mt-1 opacity-90">loan amount</p>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <TrendingDown className="w-6 h-6" />
            <span className="text-3xl">{apr.toFixed(1)}%</span>
          </div>
          <p className="mt-1 opacity-90">Annual Percentage Rate</p>
        </div>

        <div className="pt-4">
          <Button 
            className="w-full bg-white text-[#1ABC9C] hover:bg-gray-100"
            onClick={onNavigate}
          >
            View Offer Details
          </Button>
        </div>
      </div>
    </Card>
  );
}
