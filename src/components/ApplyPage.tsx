import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DollarSign, Calendar, FileText, CheckCircle, Loader2, TrendingUp, Percent } from "lucide-react";
import { CredibilityGauge } from "./CredibilityGauge";
import { toast } from "sonner";
import { useUser } from "../contexts/UserContext";

interface FormData {
  loanAmount: string;
  loanPurpose: string;
  loanTerm: string;
  employmentStatus: string;
  monthlyIncome: string;
  savingsRatio: string;
  incomeStability: string;
  missedPayments: string;
  debtToIncome: string;
}

interface LoanOffer {
  credibilityIndex: number;
  approvedAmount: number;
  interestRate: number;
  monthlyPayment: number;
  totalPayment: number;
  term: number;
}

export function ApplyPage() {
  const { updateLoanApplication } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [loanOffer, setLoanOffer] = useState<LoanOffer | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    loanAmount: "",
    loanPurpose: "",
    loanTerm: "",
    employmentStatus: "",
    monthlyIncome: "",
    savingsRatio: "",
    incomeStability: "",
    missedPayments: "",
    debtToIncome: "",
  });

  // Calculate Credibility Index using weighted formula
  const calculateCredibilityIndex = (data: FormData): number => {
    // Normalize values to 0-1 scale
    const loanAmountNorm = Math.min(parseFloat(data.loanAmount) / 50000, 1);
    const loanPurposeScore = { debt: 0.9, home: 0.8, education: 0.85, medical: 0.7, business: 0.6, emergency: 0.5 };
    const loanPurposeNorm = loanPurposeScore[data.loanPurpose as keyof typeof loanPurposeScore] || 0.5;
    const loanTermNorm = Math.min(parseFloat(data.loanTerm) / 36, 1);
    
    const employmentScore = { fulltime: 1, parttime: 0.7, selfemployed: 0.8, student: 0.4, unemployed: 0.1 };
    const employmentNorm = employmentScore[data.employmentStatus as keyof typeof employmentScore] || 0.5;
    
    const incomeNorm = Math.min(parseFloat(data.monthlyIncome) / 10000, 1);
    
    const savingsScore = { "0-10": 0.3, "10-25": 0.6, "25-50": 0.9, "50+": 1 };
    const savingsNorm = savingsScore[data.savingsRatio as keyof typeof savingsScore] || 0.5;
    
    const stabilityScore = { consistent: 1, fluctuation: 0.6, variable: 0.3 };
    const stabilityNorm = stabilityScore[data.incomeStability as keyof typeof stabilityScore] || 0.5;
    
    const missedScore = { "0": 1, "1-2": 0.7, "3-5": 0.4, "6+": 0.1 };
    const missedNorm = missedScore[data.missedPayments as keyof typeof missedScore] || 0.5;
    
    const debtScore = { "0-20": 1, "21-40": 0.8, "41-60": 0.5, "61+": 0.2 };
    const debtNorm = debtScore[data.debtToIncome as keyof typeof debtScore] || 0.5;
    
    // Weighted calculation (from image)
    const cli = 100 * (
      0.10 * loanAmountNorm +
      0.10 * loanPurposeNorm +
      0.10 * loanTermNorm +
      0.15 * employmentNorm +
      0.15 * incomeNorm +
      0.10 * savingsNorm +
      0.10 * stabilityNorm +
      0.15 * missedNorm +
      0.05 * debtNorm
    );
    
    return Math.round(cli);
  };

  const calculateLoanOffer = (data: FormData): LoanOffer => {
    const cli = calculateCredibilityIndex(data);
    const requestedAmount = parseFloat(data.loanAmount);
    const term = parseFloat(data.loanTerm);
    
    // Determine approval percentage and interest rate based on CLI
    let approvalPercentage = 1;
    let baseRate = 6;
    
    if (cli >= 80) {
      approvalPercentage = 1.0;
      baseRate = 5.5;
    } else if (cli >= 60) {
      approvalPercentage = 0.9;
      baseRate = 7.5;
    } else if (cli >= 40) {
      approvalPercentage = 0.7;
      baseRate = 10;
    } else {
      approvalPercentage = 0.5;
      baseRate = 15;
    }
    
    const approvedAmount = Math.round(requestedAmount * approvalPercentage);
    const monthlyRate = baseRate / 100 / 12;
    const monthlyPayment = approvedAmount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
    const totalPayment = monthlyPayment * term;
    
    return {
      credibilityIndex: cli,
      approvedAmount,
      interestRate: baseRate,
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      term,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.loanAmount || !formData.loanPurpose || !formData.loanTerm || 
        !formData.employmentStatus || !formData.monthlyIncome || !formData.savingsRatio ||
        !formData.incomeStability || !formData.missedPayments || !formData.debtToIncome) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);

    // Calculate offer
    setTimeout(() => {
      const offer = calculateLoanOffer(formData);
      setLoanOffer(offer);
      
      // Save to context
      updateLoanApplication({
        ...offer,
        requestedAmount: parseFloat(formData.loanAmount),
        appliedDate: new Date().toLocaleDateString()
      });
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Application submitted successfully!");

      // Show result after 2 seconds
      setTimeout(() => {
        setShowResult(true);
      }, 2000);
    }, 2000);
  };

  // Success screen after submission
  if (isSubmitted && !showResult) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-12 text-center">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-3xl text-gray-900 mb-4">✅ Application Submitted</h2>
          <p className="text-xl text-gray-600 mb-8">
            We're calculating your Credibility Index using AI insights...
          </p>
          <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
        </Card>
      </div>
    );
  }

  // Result screen
  if (showResult && loanOffer) {
    const riskLevel = loanOffer.credibilityIndex >= 80 ? "Low Risk" : 
                     loanOffer.credibilityIndex >= 60 ? "Medium Risk" : "High Risk";
    const riskColor = loanOffer.credibilityIndex >= 80 ? "text-green-600" : 
                     loanOffer.credibilityIndex >= 60 ? "text-yellow-600" : "text-orange-600";
    
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-12">
          <h2 className="text-3xl text-center text-gray-900 mb-8">
            Your Loan Offer Details
          </h2>
          
          <CredibilityGauge score={loanOffer.credibilityIndex} />
          
          <div className="text-center mt-8">
            <div className={`inline-block bg-primary/10 px-6 py-3 rounded-lg mb-8 ${riskColor}`}>
              <p className="text-xl font-semibold">
                {riskLevel} – {loanOffer.credibilityIndex >= 60 ? "Approved!" : "Conditional Approval"}
              </p>
            </div>
          </div>

          {/* Loan Offer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card className="p-6 bg-gradient-to-br from-[#1ABC9C] to-[#16A085] text-white">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Approved Amount</h3>
              </div>
              <p className="text-4xl font-bold">${loanOffer.approvedAmount.toLocaleString()}</p>
              <p className="text-sm mt-2 opacity-90">
                {loanOffer.approvedAmount < parseFloat(formData.loanAmount) 
                  ? `Partial approval of requested $${parseFloat(formData.loanAmount).toLocaleString()}`
                  : "Full amount approved"}
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Percent className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Interest Rate (APR)</h3>
              </div>
              <p className="text-4xl font-bold">{loanOffer.interestRate.toFixed(2)}%</p>
              <p className="text-sm mt-2 opacity-90">Fixed rate for {loanOffer.term} months</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Monthly Payment</h3>
              </div>
              <p className="text-4xl font-bold">${loanOffer.monthlyPayment.toLocaleString()}</p>
              <p className="text-sm mt-2 opacity-90">For {loanOffer.term} months</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Total Repayment</h3>
              </div>
              <p className="text-4xl font-bold">${loanOffer.totalPayment.toLocaleString()}</p>
              <p className="text-sm mt-2 opacity-90">
                Principal + ${(loanOffer.totalPayment - loanOffer.approvedAmount).toLocaleString()} interest
              </p>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button 
              onClick={() => {
                setShowResult(false);
                setIsSubmitted(false);
                setLoanOffer(null);
              }}
              className="bg-[#1ABC9C] hover:bg-[#16A085] mr-4"
            >
              Apply for Another Loan
            </Button>
            <Button variant="outline">
              Download Offer Details
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl text-gray-900 mb-2">Apply for a Loan</h1>
        <p className="text-xl text-gray-600">
          Complete the application to get your personalized loan offer.
        </p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Loan Amount */}
            <div>
              <Label htmlFor="amount">Requested Loan Amount ($)</Label>
              <div className="relative mt-2">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="5000"
                  className="pl-10"
                  value={formData.loanAmount}
                  onChange={(e) => setFormData({...formData, loanAmount: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Loan Purpose */}
            <div>
              <Label htmlFor="purpose">Select purpose</Label>
              <Select 
                value={formData.loanPurpose} 
                onValueChange={(value) => setFormData({...formData, loanPurpose: value})}
                required
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debt">Debt Consolidation</SelectItem>
                  <SelectItem value="home">Home Improvement</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="medical">Medical Expenses</SelectItem>
                  <SelectItem value="business">Business Startup</SelectItem>
                  <SelectItem value="emergency">Emergency or Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Loan Term */}
            <div>
              <Label htmlFor="term">Select term</Label>
              <Select 
                value={formData.loanTerm} 
                onValueChange={(value) => setFormData({...formData, loanTerm: value})}
                required
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                  <SelectItem value="24">24 months</SelectItem>
                  <SelectItem value="36">36 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Employment Status */}
            <div>
              <Label htmlFor="employment">Employment Status</Label>
              <Select 
                value={formData.employmentStatus} 
                onValueChange={(value) => setFormData({...formData, employmentStatus: value})}
                required
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fulltime">Full-time</SelectItem>
                  <SelectItem value="parttime">Part-time</SelectItem>
                  <SelectItem value="selfemployed">Self-employed</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Monthly Income */}
            <div>
              <Label htmlFor="income">Average Monthly Income ($)</Label>
              <div className="relative mt-2">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="income"
                  type="number"
                  placeholder="4000"
                  className="pl-10"
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData({...formData, monthlyIncome: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Savings Ratio */}
            <div>
              <Label htmlFor="savings">What percentage of your income do you typically save?</Label>
              <Select 
                value={formData.savingsRatio} 
                onValueChange={(value) => setFormData({...formData, savingsRatio: value})}
                required
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select savings ratio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-10">0–10%</SelectItem>
                  <SelectItem value="10-25">10–25%</SelectItem>
                  <SelectItem value="25-50">25–50%</SelectItem>
                  <SelectItem value="50+">50%+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Income Stability */}
            <div>
              <Label htmlFor="stability">How stable is your income each month?</Label>
              <Select 
                value={formData.incomeStability} 
                onValueChange={(value) => setFormData({...formData, incomeStability: value})}
                required
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select stability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consistent">Very consistent</SelectItem>
                  <SelectItem value="fluctuation">Some fluctuation</SelectItem>
                  <SelectItem value="variable">Highly variable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Missed Payments */}
            <div>
              <Label htmlFor="missed">How many payments have you missed in the last 12 months?</Label>
              <Select 
                value={formData.missedPayments} 
                onValueChange={(value) => setFormData({...formData, missedPayments: value})}
                required
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="1-2">1–2</SelectItem>
                  <SelectItem value="3-5">3–5</SelectItem>
                  <SelectItem value="6+">6+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Debt-to-Income Ratio */}
            <div>
              <Label htmlFor="debt">Approximate debt-to-income ratio</Label>
              <Select 
                value={formData.debtToIncome} 
                onValueChange={(value) => setFormData({...formData, debtToIncome: value})}
                required
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select ratio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-20">0–20%</SelectItem>
                  <SelectItem value="21-40">21–40%</SelectItem>
                  <SelectItem value="41-60">41–60%</SelectItem>
                  <SelectItem value="61+">61%+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button 
                type="submit" 
                className="w-full bg-[#1ABC9C] hover:bg-[#16A085]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="p-6 text-center">
          <Calendar className="w-10 h-10 text-[#1ABC9C] mx-auto mb-3" />
          <h3 className="text-lg text-gray-800 mb-2">Quick Decision</h3>
          <p className="text-gray-600">Get approved within 24 hours.</p>
        </Card>
        <Card className="p-6 text-center">
          <FileText className="w-10 h-10 text-[#1ABC9C] mx-auto mb-3" />
          <h3 className="text-lg text-gray-800 mb-2">Simple Process</h3>
          <p className="text-gray-600">Minimal documentation required.</p>
        </Card>
        <Card className="p-6 text-center">
          <DollarSign className="w-10 h-10 text-[#1ABC9C] mx-auto mb-3" />
          <h3 className="text-lg text-gray-800 mb-2">Flexible Terms</h3>
          <p className="text-gray-600">Choose what works for you.</p>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-sm text-gray-500">
        Powered by Credibility AI • Secure • Transparent • Fair
      </div>
    </div>
  );
}