import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import '@/components/ui/slider.css'; // Ensure this path matches your file structure
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from "react-router-dom";

// Scraped Data (Simulated Web Scraping as of Feb 19, 2025)
const scrapedData = {
  taxSlabs: {
    old: [
      { limit: 250000, rate: 0 },
      { limit: 500000, rate: 0.05 },
      { limit: 1000000, rate: 0.2 },
      { limit: Infinity, rate: 0.3 },
    ],
    new: [
      { limit: 1200000, rate: 0 },
      { limit: 1275000, rate: 0.05 },
      { limit: 1500000, rate: 0.1 },
      { limit: 2000000, rate: 0.15 },
      { limit: Infinity, rate: 0.2 },
    ],
  },
  investmentRates: {
    ppf: 7.1,
    elss: 13,
    fd: 6.5,
  },
  goldPrice: 66000,
  usdToInr: 86.84,
  taxNews: [
    "New regime: ₹12 lakh tax-free (Budget 2025)",
    "Save up to ₹1,20,000 with new slabs",
  ],
};

// Core Tax Calculation Logic
const calculateTax = (income, investments, deductions, regime) => {
  const taxableIncome = income - (regime === 'old' ? investments + deductions : 75000);
  const slabs = scrapedData.taxSlabs[regime];
  let tax = 0;
  let remainingIncome = taxableIncome > 0 ? taxableIncome : 0;

  for (let i = 0; i < slabs.length; i++) {
    if (remainingIncome <= 0) break;
    const prevLimit = i === 0 ? 0 : slabs[i - 1].limit;
    const taxableAmount = Math.min(remainingIncome, slabs[i].limit - prevLimit);
    tax += taxableAmount * slabs[i].rate;
    remainingIncome -= taxableAmount;
  }
  return tax;
};

const calculateCapitalGainsTax = (capitalGains, holdingPeriod) => {
  return holdingPeriod === 'long' ? (capitalGains > 100000 ? capitalGains * 0.1 : 0) : capitalGains * 0.15;
};

const calculateGSTLiability = (gst, itc) => Math.max(gst - itc, 0);

const getRecommendations = (income, investments, deductions, capitalGains, usdIncome) => {
  const recommendations = { incomeTax: [], capitalGains: [], gst: [] };
  const { ppf, elss, fd } = scrapedData.investmentRates;

  if (investments < 150000) {
    recommendations.incomeTax.push(`Invest ₹${(150000 - investments).toLocaleString()} more in PPF @ ${ppf}% for tax-free returns.`);
  }
  if (deductions < 50000) {
    recommendations.incomeTax.push("Add health insurance (80D) up to ₹50,000 for deductions.");
  }
  if (income > 1200000 && investments + deductions < 150000) {
    recommendations.incomeTax.push(`Switch to new regime or boost investments (e.g., ELSS @ ${elss}% avg return).`);
  }
  if (usdIncome > 0) {
    recommendations.incomeTax.push(`USD ${usdIncome.toLocaleString()} converts to ₹${(usdIncome * scrapedData.usdToInr).toLocaleString()} at ₹${scrapedData.usdToInr}/USD.`);
  }
  if (capitalGains > 100000) {
    recommendations.capitalGains.push(`Gold at ₹${scrapedData.goldPrice.toLocaleString()}/10g—time sales to optimize gains.`);
  }
  return recommendations;
};

const TaxEstimator = () => {
  const navigate = useNavigate();
  const [income, setIncome] = useState(0);
  const [investments, setInvestments] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [capitalGains, setCapitalGains] = useState(0);
  const [holdingPeriod, setHoldingPeriod] = useState('short');
  const [gst, setGst] = useState(0);
  const [itc, setItc] = useState(0);
  const [taxRegime, setTaxRegime] = useState('old');
  const [usdIncome, setUsdIncome] = useState(0);
  const [recommendations, setRecommendations] = useState({ incomeTax: [], capitalGains: [], gst: [] });
  const [isExpanded, setIsExpanded] = useState(false); // State for collapsible section

  const usdConvertedIncome = usdIncome * scrapedData.usdToInr;
  const totalIncome = income + usdConvertedIncome;
  const estimatedTax = calculateTax(totalIncome, investments, deductions, taxRegime);
  const capitalGainsTax = calculateCapitalGainsTax(capitalGains, holdingPeriod);
  const gstLiability = calculateGSTLiability(gst, itc);

  useEffect(() => {
    setRecommendations(getRecommendations(totalIncome, investments, deductions, capitalGains, usdIncome));
  }, [totalIncome, investments, deductions, capitalGains, usdIncome]);

  // New tax concepts and links (based on recent Indian tax updates as of Feb 19, 2025)
  const taxConcepts = [
    { name: "Section 115BAA Benefits and Late Filings", url: "https://www.taxmanagementindia.com/case-laws/taxpayer-eligible-section-115baa-benefits-previous-years-late-form-10-ic-filing", description: "Learn how businesses can claim tax benefits under the new regime despite late filings, as clarified in recent rulings." },
    { name: "Digital Services Tax", url: "https://economictimes.indiatimes.com/topic/Digital-Services-Tax", description: "Understand India’s proposed tax on digital services by multinational tech companies for fair taxation in the digital economy." },
    { name: "Tax on Virtual Digital Assets (Crypto & NFTs)", url: "https://www.moneycontrol.com/news/income-tax/virtual-digital-assets-taxation-india/", description: "Explore the 30% tax rate and 70% penalties on undisclosed crypto gains under the Income Tax Bill, 2025." },
    { name: "TDS on Cash Withdrawals", url: "https://www.incometax.gov.in/iec/foportal/tds-cash-withdrawal", description: "Learn about the TDS on cash withdrawals exceeding ₹20 lakh annually to curb black money, effective 2025." },
    { name: "Presumptive Taxation for Non-Residents (Section 44BBD)", url: "https://www.taxsutra.com/explore/presumptive-taxation-non-residents-section-44bbd", description: "Discover how non-residents can simplify tax compliance with a fixed percentage of turnover under this scheme." },
    { name: "Black Money Act Assessments", url: "https://www.taxmanagementindia.com/case-laws/black-money-act-assessment-orders-invalid", description: "Understand how mismatched notices can invalidate assessments for individuals with foreign assets under the Black Money Act, 2015." },
    { name: "GST Recovery and Refunds at Detention", url: "https://www.taxmanagementindia.com/articles/tax-collected-detention-claimed-gst-refund", description: "Learn how businesses can claim GST refunds for excess tax paid during detention, a recent clarification." },
    { name: "Tax Expenditure Analysis", url: "https://economictimes.indiatimes.com/topic/Tax-Expenditure", description: "Explore how tax code provisions like deductions cause revenue losses, a key policy focus in 2025." },
    { name: "Section 80CCD(1B) for NPS Vatsalya", url: "https://economictimes.indiatimes.com/topic/NPS-Vatsalya", description: "Understand the ₹50,000 tax deduction for NPS Vatsalya subscribers, a new benefit for minors’ pension savings in 2025." },
    { name: "Income Tax E-Proceedings", url: "https://www.incometax.gov.in/iec/foportal/e-proceedings", description: "Learn about the digital e-Proceeding facility for electronic tax proceedings, reducing office visits, launched in 2025." },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tax Estimator Tool (Feb 2025)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="incomeTax" className="space-y-6">
            <TabsList className="space-x-4">
              <TabsTrigger value="incomeTax">Income Tax</TabsTrigger>
              <TabsTrigger value="capitalGains">Capital Gains</TabsTrigger>
              <TabsTrigger value="gst">GST & ITC</TabsTrigger>
              <TabsTrigger value="updates">Tax Updates</TabsTrigger>
            </TabsList>
            <TabsContent value="incomeTax" className="space-y-4">
              <label>Annual Income (₹): ₹{income.toLocaleString()}</label>
              <Slider min={0} max={5000000} step={10000} value={[income]} onValueChange={([val]) => setIncome(val)} className="custom-slider" />
              <label>Foreign Income ($): ₹{usdIncome.toLocaleString()}</label>
              <Slider min={0} max={100000} step={100} value={[usdIncome]} onValueChange={([val]) => setUsdIncome(val)} className="custom-slider" />
              {usdIncome > 0 && (
                <p>Converted Foreign Income: ₹{usdConvertedIncome.toLocaleString()} (at ₹{scrapedData.usdToInr}/USD)</p>
              )}
              {taxRegime === 'old' && (
                <>
                  <label>Investments (80C): ₹{investments.toLocaleString()}</label>
                  <Slider min={0} max={150000} step={1000} value={[investments]} onValueChange={([val]) => setInvestments(val)} className="custom-slider" />
                  <label>Deductions (80D, etc.): ₹{deductions.toLocaleString()}</label>
                  <Slider min={0} max={200000} step={1000} value={[deductions]} onValueChange={([val]) => setDeductions(val)} className="custom-slider" />
                </>
              )}
              <div className="flex space-x-4">
                <Button onClick={() => setTaxRegime('old')} variant={taxRegime === 'old' ? 'default' : 'outline'}>Old Regime</Button>
                <Button onClick={() => setTaxRegime('new')} variant={taxRegime === 'new' ? 'default' : 'outline'}>New Regime</Button>
              </div>
              <p>Total Taxable Income: ₹{totalIncome.toLocaleString()}</p>
              <p>Estimated Tax: ₹{estimatedTax.toLocaleString()}</p>
              <Progress value={totalIncome > 0 ? (estimatedTax / totalIncome) * 100 : 0} />
              {recommendations.incomeTax.length > 0 && (
                <div className="p-4 bg-gray-100 rounded">
                  <h3 className="font-semibold">Income Tax Tips:</h3>
                  <ul className="list-disc pl-4">
                    {recommendations.incomeTax.map((tip, index) => <li key={index}>{tip}</li>)}
                  </ul>
                </div>
              )}
            </TabsContent>
            <TabsContent value="capitalGains" className="space-y-4">
              <label>Capital Gains: ₹{capitalGains.toLocaleString()}</label>
              <Slider min={0} max={5000000} step={10000} value={[capitalGains]} onValueChange={([val]) => setCapitalGains(val)} className="custom-slider" />
              <div className="flex space-x-4">
                <Button onClick={() => setHoldingPeriod('short')} variant={holdingPeriod === 'short' ? 'default' : 'outline'}>Short Term</Button>
                <Button onClick={() => setHoldingPeriod('long')} variant={holdingPeriod === 'long' ? 'default' : 'outline'}>Long Term</Button>
              </div>
              <p>Capital Gains Tax: ₹{capitalGainsTax.toLocaleString()}</p>
              <p>Gold Price (10g): ₹{scrapedData.goldPrice.toLocaleString()} (Feb 2025)</p>
              {recommendations.capitalGains.length > 0 && (
                <div className="p-4 bg-gray-100 rounded">
                  <h3 className="font-semibold">Capital Gains Tips:</h3>
                  <ul className="list-disc pl-4">
                    {recommendations.capitalGains.map((tip, index) => <li key={index}>{tip}</li>)}
                  </ul>
                </div>
              )}
            </TabsContent>
            <TabsContent value="gst" className="space-y-4">
              <label>GST Liability: ₹{gst.toLocaleString()}</label>
              <Slider min={0} max={1000000} step={1000} value={[gst]} onValueChange={([val]) => setGst(val)} className="custom-slider" />
              <label>Input Tax Credit (ITC): ₹{itc.toLocaleString()}</label>
              <Slider min={0} max={gst} step={1000} value={[itc]} onValueChange={([val]) => setItc(val)} className="custom-slider" />
              <p>Net GST Liability: ₹{gstLiability.toLocaleString()}</p>
            </TabsContent>
            <TabsContent value="updates" className="space-y-4">
              <h3 className="font-semibold">Tax Updates (Feb 2025)</h3>
              <ul className="list-disc pl-4">
                {scrapedData.taxNews.map((news, index) => <li key={index}>{news}</li>)}
              </ul>
              <p>Investment Rates:</p>
              <ul className="list-disc pl-4">
                <li>PPF: {scrapedData.investmentRates.ppf}%</li>
                <li>ELSS (10-yr avg): {scrapedData.investmentRates.elss}%</li>
                <li>FD: {scrapedData.investmentRates.fd}%</li>
              </ul>
            </TabsContent>
          </Tabs>

          {/* New "Want to Know More?" Section */}
          <div className="mt-6">
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center w-full bg-gray-200 hover:bg-gray-300 text-black p-2 rounded"
            >
              Want to Know More? {isExpanded ? '▲' : '▼'}
            </Button>
            {isExpanded && (
              <div className="p-4 bg-gray-100 rounded mt-2">
                <h3 className="font-semibold mb-2">Explore Recent Tax Concepts</h3>
                <ul className="list-disc pl-4 space-y-2">
                  {taxConcepts.map((concept, index) => (
                    <li key={index}>
                      <a
                        href={concept.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {concept.name}: {concept.description}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Button onClick={() => navigate("/goal-tracker")}>Dashboard</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxEstimator;