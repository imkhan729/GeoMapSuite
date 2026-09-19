import React from 'react';
import { DistanceUnit, AreaUnit, getUnitLabel } from '@/lib/geo';

interface UnitSwitcherProps<T extends DistanceUnit | AreaUnit> {
  value: T;
  onChange: (val: T) => void;
  options: T[];
  label?: string;
}

export function UnitSwitcher<T extends DistanceUnit | AreaUnit>({
  value,
  onChange,
  options,
  label = 'Unit',
}: UnitSwitcherProps<T>) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-semibold text-navy-700">{label}</label>}
      <div className="inline-flex rounded-xl border border-navy-200 bg-navy-50/70 p-1">
        {options.map((opt) => {
          const isSelected = opt === value;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-white text-navy-950 shadow-sm border border-navy-200/60 font-semibold'
                  : 'text-navy-600 hover:text-navy-900 hover:bg-white/50'
              }`}
            >
              {getUnitLabel(opt).split(' ')[0]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
