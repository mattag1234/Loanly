import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DollarSign, Calendar, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useApplication, ApplicationData } from "../contexts/ApplicationContext";

interface ApplyPageProps {
  onNavigateToDashboard: () => void;
}

export function ApplyPage({ onNavigateToDashboard }: ApplyPageProps) {
  const { setApplicationData, calculateMetrics } = useApplication();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    loanAmount: "5000",
    loanPurpose: "debt",
    loanTerm: "12",
    employmentStatus: "fulltime",
    monthlyIncome: "4000",
    savingsRatio: "10-25",
    incomeStability: "consistent",
    missedPayments: "0",
    debtToIncome: "0-20"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("=== FORM SUBMISSION STARTED ===");
    console.log("Form data:", formData);
    
    setIsSubmitting(true);
    toast.loading("Processing your application...", { id: "submit-toast" });

    // Prepare application data - convert strings to numbers where needed
    const appData: ApplicationData = {
      loanAmount: parseFloat(formData.loanAmount) || 5000,
      loanPurpose: formData.loanPurpose || "debt",
      loanTerm: formData.loanTerm || "12",
      employmentStatus: formData.employmentStatus || "fulltime",
      monthlyIncome: parseFloat(formData.monthlyIncome) || 4000,
      savingsRatio: formData.savingsRatio || "10-25",
      incomeStability: formData.incomeStability || "consistent",
      missedPayments: formData.missedPayments || "0",
      debtToIncomeRatio: formData.debtToIncome || "0-20",
      submittedAt: new Date(),
    };

    console.log("Saving application data:", appData);
    
    // Calculate metrics first to get the score
    const calculatedMetrics = calculateMetrics(appData);
    const score = calculatedMetrics.credibilityScore;
    
    // Save to context
    setApplicationData(appData);

    // Show loading for 2 seconds, then redirect
    setTimeout(() => {
      setIsSubmitting(false);
      toast.dismiss("submit-toast");
      
      // Show beautiful success message with the calculated score
      toast.success(`Application Approved! Score: ${score}`, {
        duration: 2500,
        style: {
          background: '#10B981',
          color: 'white',
          fontSize: '16px',
          fontWeight: '600',
          padding: '16px 24px',
          borderRadius: '12px',
        },
      });

      // Redirect to Dashboard after 1 second
      setTimeout(() => {
        console.log("Navigating to Dashboard with score:", score);
        onNavigateToDashboard();
      }, 1000);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl text-gray-900 mb-2">Apply for a Loan</h1>
        <p className="text-xl text-gray-600">
          Complete the application to get your personalized loan offer.
        </p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} noValidate>
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
                />
              </div>
            </div>

            {/* Loan Purpose */}
            <div>
              <Label htmlFor="purpose">Select purpose</Label>
              <Select 
                value={formData.loanPurpose}
                onValueChange={(value) => setFormData({...formData, loanPurpose: value})}
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
                />
              </div>
            </div>

            {/* Savings Ratio */}
            <div>
              <Label htmlFor="savings">What percentage of your income do you typically save?</Label>
              <Select 
                value={formData.savingsRatio}
                onValueChange={(value) => setFormData({...formData, savingsRatio: value})}
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
                className="w-full bg-[#1ABC9C] hover:bg-[#16A085] text-lg py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing Application...
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
