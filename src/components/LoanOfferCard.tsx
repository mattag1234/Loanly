import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { DollarSign, TrendingDown } from "lucide-react";

export function LoanOfferCard() {
  return (
    <Card className="p-6 bg-gradient-to-br from-[#1ABC9C] to-[#16A085] text-white">
      <h3 className="text-xl mb-4">Loan Offer Preview</h3>
      
      <div className="space-y-6">
        <div>
          <p className="text-sm opacity-90 mb-2">You may qualify for:</p>
          <div className="flex items-baseline gap-2">
            <DollarSign className="w-8 h-8" />
            <span className="text-4xl">8,000</span>
          </div>
          <p className="mt-1 opacity-90">loan amount</p>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <TrendingDown className="w-6 h-6" />
            <span className="text-3xl">6.2%</span>
          </div>
          <p className="mt-1 opacity-90">Annual Percentage Rate</p>
        </div>

        <div className="pt-4">
          <Button 
            className="w-full bg-white text-[#1ABC9C] hover:bg-gray-100"
          >
            View Offer Details
          </Button>
        </div>
      </div>
    </Card>
  );
}
