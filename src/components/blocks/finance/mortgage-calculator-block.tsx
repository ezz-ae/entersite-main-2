'use client';

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { DollarSign, Percent, Calculator } from "lucide-react";

export function MortgageCalculatorBlock({
  headline = "Mortgage Calculator",
  subtext = "Estimate your monthly payments and find a plan that suits your budget."
}: { headline?: string, subtext?: string }) {
  const [price, setPrice] = useState(1500000);
  const [downPayment, setDownPayment] = useState(300000); // 20%
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(25);

  const calculateMonthlyPayment = () => {
    const principal = price - downPayment;
    const monthlyInterest = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    if (interestRate === 0) return principal / numberOfPayments;

    const monthlyPayment =
      (principal * monthlyInterest * Math.pow(1 + monthlyInterest, numberOfPayments)) /
      (Math.pow(1 + monthlyInterest, numberOfPayments) - 1);

    return monthlyPayment.toFixed(2);
  };

  const monthlyPayment = calculateMonthlyPayment();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">{headline}</h2>
          <p className="text-lg text-muted-foreground">{subtext}</p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-8 bg-card border p-6 rounded-xl shadow-sm">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label>Property Price (AED)</Label>
                        <span className="font-semibold text-primary">{price.toLocaleString()}</span>
                    </div>
                    <Slider 
                        value={[price]} 
                        min={500000} 
                        max={10000000} 
                        step={50000} 
                        onValueChange={(val) => setPrice(val[0])} 
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label>Down Payment (AED)</Label>
                        <span className="font-semibold text-primary">{downPayment.toLocaleString()}</span>
                    </div>
                    <Slider 
                        value={[downPayment]} 
                        min={0} 
                        max={price} 
                        step={10000} 
                        onValueChange={(val) => setDownPayment(val[0])} 
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label>Interest Rate (%)</Label>
                        <span className="font-semibold text-primary">{interestRate}%</span>
                    </div>
                    <Slider 
                        value={[interestRate]} 
                        min={1} 
                        max={10} 
                        step={0.1} 
                        onValueChange={(val) => setInterestRate(val[0])} 
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label>Loan Term (Years)</Label>
                        <span className="font-semibold text-primary">{loanTerm} Years</span>
                    </div>
                    <Slider 
                        value={[loanTerm]} 
                        min={5} 
                        max={30} 
                        step={1} 
                        onValueChange={(val) => setLoanTerm(val[0])} 
                    />
                </div>
            </div>

            <div className="bg-primary text-primary-foreground p-8 rounded-xl shadow-lg flex flex-col items-center justify-center h-full text-center space-y-6">
                <div className="bg-white/10 p-4 rounded-full">
                    <Calculator className="h-8 w-8" />
                </div>
                <div>
                    <p className="text-lg opacity-80 mb-1">Estimated Monthly Payment</p>
                    <h3 className="text-5xl font-bold">AED {Number(monthlyPayment).toLocaleString()}</h3>
                </div>
                <div className="w-full space-y-2 pt-4 border-t border-white/20">
                    <div className="flex justify-between text-sm opacity-90">
                        <span>Loan Amount</span>
                        <span>AED {(price - downPayment).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm opacity-90">
                        <span>Total Interest</span>
                        <span>AED {((Number(monthlyPayment) * loanTerm * 12) - (price - downPayment)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
