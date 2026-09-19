import React from 'react';
import { Calculator, CheckCircle2 } from 'lucide-react';

export interface WorkedExampleProps {
  title: string;
  scenario: string;
  inputs: { label: string; value: string }[];
  steps: string[];
  output: { label: string; value: string }[];
  explanation: string;
}

export function WorkedExample({
  title,
  scenario,
  inputs,
  steps,
  output,
  explanation,
}: WorkedExampleProps) {
  return (
    <section className="my-8 rounded-2xl border border-[#e8e6e1] bg-[#fcfbf9] p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2a6e4e] text-white shadow-xs">
          <Calculator className="h-4 w-4" />
        </div>
        <h3 className="font-serif text-lg font-semibold text-[#1a1a18]">{title}</h3>
      </div>

      <p className="text-sm text-[#54524b] leading-relaxed mb-6">{scenario}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Inputs */}
        <div className="rounded-xl border border-[#e8e6e1] bg-white p-5 shadow-2xs">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#737067] mb-3">Input Parameters</h4>
          <dl className="space-y-2 text-xs sm:text-[13px]">
            {inputs.map((inp, idx) => (
              <div key={idx} className="flex justify-between border-b border-[#f0eee8] pb-1.5 last:border-0 last:pb-0">
                <dt className="text-[#737067]">{inp.label}</dt>
                <dd className="font-mono font-semibold text-[#1a1a18]">{inp.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Expected Results */}
        <div className="rounded-xl border border-[#c7ded2] bg-[#f4f8f5] p-5 shadow-2xs">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#235c41] mb-3">Computed Outputs</h4>
          <dl className="space-y-2 text-xs sm:text-[13px]">
            {output.map((out, idx) => (
              <div key={idx} className="flex justify-between border-b border-[#d8ebe0] pb-1.5 last:border-0 last:pb-0">
                <dt className="text-[#2a6e4e] font-medium">{out.label}</dt>
                <dd className="font-mono font-bold text-[#1a1a18]">{out.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Step by step calculation */}
      <div className="space-y-3 mb-6">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#737067]">Step-by-Step Mathematical Process</h4>
        <ol className="space-y-2 text-xs sm:text-sm text-[#54524b]">
          {steps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#2a6e4e] shrink-0 mt-0.5" />
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="text-xs sm:text-[13px] text-[#54524b] bg-white p-5 rounded-xl border border-[#e8e6e1] leading-relaxed">
        <strong className="text-[#1a1a18]">Practical Takeaway:</strong> {explanation}
      </div>
    </section>
  );
}
