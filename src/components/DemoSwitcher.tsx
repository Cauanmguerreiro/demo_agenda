import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Sparkles, Check } from 'lucide-react';
import { demos } from '../config/demos';

interface DemoSwitcherProps {
  currentDemoId: string;
  onSelectDemo: (demoId: string) => void;
}

export const DemoSwitcher: React.FC<DemoSwitcherProps> = ({
  currentDemoId,
  onSelectDemo,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeDemo = demos[currentDemoId] || demos.salao;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition-colors border border-slate-200/60"
        title="Alternar demonstração de segmento"
      >
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeDemo.colors.primary }} />
        <span className="truncate max-w-[130px] sm:max-w-none">{activeDemo.business.name}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-slate-200 z-50 py-1.5 animate-fade-in divide-y divide-slate-100">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Selecione um segmento:
          </div>

          <div className="py-1">
            {Object.values(demos).map((d) => {
              const isSelected = d.id === currentDemoId;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    onSelectDemo(d.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                    isSelected ? 'bg-slate-50 text-slate-900 font-semibold' : 'text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: d.colors.primary }}
                    />
                    <div className="truncate">
                      <div className="truncate font-medium">{d.business.name}</div>
                      <div className="text-[10px] text-slate-400">{d.business.category}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
