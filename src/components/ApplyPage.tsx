import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DollarSign, Calendar, FileText, CheckCircle, Loader2 } from "lucide-react";
import { CredibilityGauge } from "./CredibilityGauge";
import { loanApplicationSchema, LoanApplicationFormData, defaultLoanApplicationValues } from "../schemas/loanApplicationSchema";
import { toast } from "sonner";

export function ApplyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoanApplicationFormData>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: defaultLoanApplicationValues,
  });

  const handleSubmit = (data: LoanApplicationFormData) => {
    console.log("Form data:", data);
    setIsSubmitting(true);

    // Show loading for 2 seconds
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Application submitted successfully!");

      // Show result after another 2 seconds
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
  if (showResult) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-12">
          <h2 className="text-3xl text-center text-gray-900 mb-8">
            Your Application Results
          </h2>
          <CredibilityGauge score={82} />
          <div className="text-center mt-8">
            <div className="inline-block bg-primary/10 px-6 py-3 rounded-lg mb-6">
              <p className="text-xl text-primary">
                Low Risk – You're likely to qualify for a loan!
              </p>
            </div>
            <div>
              <Button className="bg-[#1ABC9C] hover:bg-[#16A085]">
                View Loan Offer
              </Button>
            </div>
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
        <form onSubmit={handleFormSubmit(handleSubmit)}>
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
                  {...register("loanAmount")}
                />
                {errors.loanAmount && (
                  <p className="text-sm text-error mt-1">{errors.loanAmount.message}</p>
                )}
              </div>
            </div>

            {/* Loan Purpose */}
            <div>
              <Label htmlFor="purpose">Select purpose</Label>
              <Select required>
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
              <Select required>
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
              <Select required>
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
                  required
                />
              </div>
            </div>

            {/* Savings Ratio */}
            <div>
              <Label htmlFor="savings">What percentage of your income do you typically save?</Label>
              <Select required>
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
              <Select required>
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
              <Select required>
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
              <Select required>
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