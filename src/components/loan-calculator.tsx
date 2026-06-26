// src/components/loan-calculator.tsx
// Standalone loan repayment calculator — drop inside FinanceHub or Settings.
// No dependencies beyond React.
import { useState, useMemo } from "react";
import { Calculator } from "lucide-react";
import { ghs } from "@/lib/seed";

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function calcRepayment(principal: number, annualRate: number, months: number) {
  if (months === 0 || principal === 0) return { monthly: 0, total: 0, interest: 0, schedule: [] };
  const r = annualRate / 100 / 12;
  const monthly =
    r === 0
      ? principal / months
      : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const total = monthly * months;
  const interest = total - principal;

  // Amortisation schedule (first 6 rows)
  const schedule: { month: number; payment: number; interest: number; principal: number; balance: number }[] = [];
  let balance = principal;
  for (let m = 1; m <= Math.min(months, 6); m++) {
    const intPart = balance * r;
    const prinPart = monthly - intPart;
    balance = Math.max(0, balance - prinPart);
    schedule.push({
      month: m,
      payment: round2(monthly),
      interest: round2(intPart),
      principal: round2(prinPart),
      balance: round2(balance),
    });
  }

  return { monthly: round2(monthly), total: round2(total), interest: round2(interest), schedule };
}

export function LoanCalculator() {
  const [principal, setPrincipal] = useState(5000);
  const [rate, setRate] = useState(24); // 24% p.a. — typical MFI in Ghana
  const [months, setMonths] = useState(12);

  const { monthly, total, interest, schedule } = useMemo(
    () => calcRepayment(principal, rate, months),
    [principal, rate, months]
  );

  const pctInterest = total > 0 ? Math.round((interest / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-5">
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5 text-[#2E7D32]" />
        <h3 className="font-display font-semibold">Loan repayment calculator</h3>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {/* Principal */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="font-medium">Loan amount</label>
            <span className="text-[#2E7D32] font-semibold">{ghs(principal)}</span>
          </div>
          <input
            type="range"
            min={500}
            max={50000}
            step={500}
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full accent-[#2E7D32]"
          />
          <div className="flex justify-between text-xs text-[#94A3B8]">
            <span>GHS 500</span><span>GHS 50,000</span>
          </div>
        </div>

        {/* Rate */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="font-medium">Interest rate</label>
            <span className="text-[#F9A825] font-semibold">{rate}% p.a.</span>
          </div>
          <input
            type="range"
            min={5}
            max={60}
            step={1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-[#F9A825]"
          />
          <div className="flex justify-between text-xs text-[#94A3B8]">
            <span>5%</span><span>60%</span>
          </div>
        </div>

        {/* Term */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="font-medium">Loan term</label>
            <span className="text-[#64748B] font-semibold">{months} months</span>
          </div>
          <input
            type="range"
            min={1}
            max={36}
            step={1}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full accent-[#64748B]"
          />
          <div className="flex justify-between text-xs text-[#94A3B8]">
            <span>1 mo</span><span>36 mo</span>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-center">
          <div className="text-xs text-[#64748B]">Monthly payment</div>
          <div className="font-display text-xl font-bold text-[#2E7D32] mt-1">{ghs(monthly)}</div>
        </div>
        <div className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-center">
          <div className="text-xs text-[#64748B]">Total repayable</div>
          <div className="font-display text-xl font-bold text-[#1E293B] mt-1">{ghs(total)}</div>
        </div>
        <div className="rounded-lg bg-[#FEF3C7] border border-[#FDE68A] p-3 text-center">
          <div className="text-xs text-[#92400E]">Total interest</div>
          <div className="font-display text-xl font-bold text-[#F59E0B] mt-1">{ghs(interest)}</div>
        </div>
      </div>

      {/* Interest bar */}
      <div>
        <div className="flex justify-between text-xs text-[#64748B] mb-1.5">
          <span>Principal</span>
          <span>Interest ({pctInterest}%)</span>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden">
          <div
            className="bg-[#2E7D32]"
            style={{ width: `${100 - pctInterest}%` }}
          />
          <div
            className="bg-[#F9A825]"
            style={{ width: `${pctInterest}%` }}
          />
        </div>
      </div>

      {/* Amortisation table (first 6 months) */}
      {schedule.length > 0 && (
        <div>
          <p className="text-xs text-[#64748B] mb-2">First {schedule.length} payments</p>
          <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#64748B]">
                  {["Month", "Payment", "Interest", "Principal", "Balance"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.month} className="border-t border-[#E2E8F0]">
                    <td className="px-3 py-2 text-[#1E293B]">{row.month}</td>
                    <td className="px-3 py-2 font-medium">{ghs(row.payment)}</td>
                    <td className="px-3 py-2 text-[#F9A825]">{ghs(row.interest)}</td>
                    <td className="px-3 py-2 text-[#2E7D32]">{ghs(row.principal)}</td>
                    <td className="px-3 py-2 text-[#64748B]">{ghs(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs text-[#94A3B8]">
        * This calculator is for illustrative purposes. Actual rates and terms are set by our partnered BOG-licensed MFIs.
      </p>
    </div>
  );
}