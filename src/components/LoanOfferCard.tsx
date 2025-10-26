import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { DollarSign, TrendingDown, Calendar, AlertCircle } from "lucide-react";
import { useUser } from "../contexts/UserContext";

export function LoanOfferCard() {
  const { loanApplication } = useUser();

  if (!loanApplication) {
    return (
      <Card className="p-6 bg-gradient-to-br from-gray-400 to-gray-500 text-white">
        <h3 className="text-xl mb-4">Loan Offer Preview</h3>
        <div className="space-y-4 text-center py-8">
          <AlertCircle className="w-12 h-12 mx-auto opacity-70" />
          <p className="text-sm opacity-90">
            No application on file.<br />
            Apply for a loan to see your personalized offer.
          </p>
          <Button 
            className="w-full bg-white text-gray-600 hover:bg-gray-100 mt-4"
          >
            Apply Now
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-[#1ABC9C] to-[#16A085] text-white">
      <h3 className="text-xl mb-4">Your Loan Offer</h3>
      
      <div className="space-y-6">
        <div>
          <p className="text-sm opacity-90 mb-2">Approved Amount:</p>
          <div className="flex items-baseline gap-2">
            <DollarSign className="w-8 h-8" />
            <span className="text-4xl">{loanApplication.approvedAmount.toLocaleString()}</span>
          </div>
          <p className="mt-1 text-xs opacity-75">
            Applied: {loanApplication.appliedDate}
          </p>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <TrendingDown className="w-6 h-6" />
            <span className="text-3xl">{loanApplication.interestRate.toFixed(2)}%</span>
          </div>
          <p className="mt-1 opacity-90">Annual Percentage Rate</p>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <Calendar className="w-5 h-5" />
            <span className="text-2xl">${loanApplication.monthlyPayment.toLocaleString()}/mo</span>
          </div>
          <p className="mt-1 text-sm opacity-90">
            For {loanApplication.term} months
          </p>
        </div>

        <div className="pt-4">
          <Button 
            className="w-full bg-white text-[#1ABC9C] hover:bg-gray-100"
          >
            View Full Details
          </Button>
        </div>
      </div>
    </Card>
  );
}
