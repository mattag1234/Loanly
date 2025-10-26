import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Calendar, TrendingDown, CreditCard, Clock, ArrowLeft } from "lucide-react";
import { useApplication } from "../contexts/ApplicationContext";

interface LoanOfferDetailsPageProps {
  onBack: () => void;
}

export function LoanOfferDetailsPage({ onBack }: LoanOfferDetailsPageProps) {
  const { application, metrics } = useApplication();

  // Calculate APR based on credibility score
  const calculateAPR = (score: number): number => {
    if (score >= 90) return 3.5 + (100 - score) * 0.15;
    if (score >= 80) return 5.0 + (90 - score) * 0.20;
    if (score >= 70) return 7.0 + (80 - score) * 0.20;
    if (score >= 60) return 9.0 + (70 - score) * 0.30;
    return Math.min(12.0 + (60 - score) * 0.15, 18.0);
  };

  const credibilityScore = metrics?.credibilityScore || 82;
  const loanAmount = application?.loanAmount || 8000;
  const loanTerm = parseInt(application?.loanTerm || "12");
  const apr = calculateAPR(credibilityScore);
  
  // Calculate monthly payment: M = P * (r(1+r)^n) / ((1+r)^n - 1)
  const monthlyRate = apr / 100 / 12;
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
  
  const appliedDate = application?.submittedAt 
    ? new Date(application.submittedAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });

  const formattedAmount = loanAmount.toLocaleString('en-US');
  const formattedMonthlyPayment = Math.round(monthlyPayment).toLocaleString('en-US');

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Button
        onClick={onBack}
        variant="ghost"
        className="mb-6 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <div className="mb-8">
        <h1 className="text-4xl text-gray-900 mb-2">Loan Offer</h1>
        <p className="text-xl text-gray-600">
          Your personalized loan offer details.
        </p>
      </div>

      {/* Main Offer Card */}
      <Card className="p-8 mb-8 bg-gradient-to-br from-[#1ABC9C] to-[#16A085] text-white">
        <h2 className="text-2xl mb-6">Your Loan Offer</h2>
        
        <div className="space-y-6">
          {/* Approved Amount */}
          <div>
            <p className="text-sm opacity-90 mb-2">Approved Amount:</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold">$ {formattedAmount}</span>
            </div>
            <p className="text-sm opacity-90 mt-2">Applied: {appliedDate}</p>
          </div>

          {/* APR */}
          <div className="flex items-center gap-3">
            <TrendingDown className="w-8 h-8" />
            <div>
              <span className="text-4xl font-bold">{apr.toFixed(2)}%</span>
              <p className="text-sm opacity-90 mt-1">Annual Percentage Rate</p>
            </div>
          </div>

          {/* Monthly Payment */}
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8" />
            <div>
              <span className="text-4xl font-bold">${formattedMonthlyPayment}/mo</span>
              <p className="text-sm opacity-90 mt-1">For {loanTerm} months</p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Button 
              className="w-full bg-white text-[#1ABC9C] hover:bg-gray-100 text-lg py-6"
            >
              View Full Details
            </Button>
          </div>
        </div>
      </Card>

      {/* Loan Details Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#1ABC9C]/10 rounded-lg">
              <CreditCard className="w-6 h-6 text-[#1ABC9C]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Repayment</h3>
              <p className="text-2xl text-[#1ABC9C] font-bold">
                ${Math.round(monthlyPayment * loanTerm).toLocaleString('en-US')}
              </p>
              <p className="text-sm text-gray-600 mt-1">Over {loanTerm} months</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#1ABC9C]/10 rounded-lg">
              <Clock className="w-6 h-6 text-[#1ABC9C]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Loan Term</h3>
              <p className="text-2xl text-[#1ABC9C] font-bold">{loanTerm} months</p>
              <p className="text-sm text-gray-600 mt-1">Fixed rate period</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Information */}
      <Card className="p-6 bg-[#F5F7FA]">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Loan Amount</span>
            <span className="font-semibold text-gray-900">${formattedAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Interest Rate (APR)</span>
            <span className="font-semibold text-gray-900">{apr.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Monthly Payment</span>
            <span className="font-semibold text-gray-900">${formattedMonthlyPayment}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Loan Term</span>
            <span className="font-semibold text-gray-900">{loanTerm} months</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Interest</span>
            <span className="font-semibold text-gray-900">
              ${Math.round((monthlyPayment * loanTerm) - loanAmount).toLocaleString('en-US')}
            </span>
          </div>
          <div className="h-px bg-gray-300 my-2"></div>
          <div className="flex justify-between">
            <span className="text-gray-900 font-semibold">Total Repayment</span>
            <span className="font-bold text-[#1ABC9C] text-lg">
              ${Math.round(monthlyPayment * loanTerm).toLocaleString('en-US')}
            </span>
          </div>
        </div>
      </Card>

      {/* Important Notice */}
      <Card className="mt-6 p-6 border-l-4 border-l-[#F39C12]">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Information</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• This is a personalized offer based on your Credibility Index of {credibilityScore}</li>
          <li>• Your rate is locked for 30 days from the application date</li>
          <li>• No prepayment penalties - pay off your loan early without fees</li>
          <li>• Funds can be disbursed within 24-48 hours of approval</li>
        </ul>
      </Card>
    </div>
  );
}

