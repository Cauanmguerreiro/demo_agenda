import React, { useState, useRef, useEffect } from 'react';
import { demos } from '../config/demos';
import {
  Sparkles,
  Check,
  ChevronUp,
  X,
  Building2,
  Scissors,
  Stethoscope,
  Sparkle,
  Brain,
  Dog,
  Briefcase,
} from 'lucide-react';

interface FloatingDemoSelectorProps {
  currentDemoId: string;
  onSelectDemo: (demoId: string) => void;
  presentationMode: boolean;
}

export const FloatingDemoSelector: React.FC<FloatingDemoSelectorProps> = ({
  currentDemoId,
  onSelectDemo,
  presentationMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (presentationMode) {
    return null;
  }

  const activeDemo = demos[currentDemoId] || demos.salao;

  const getSegmentIcon = (id: string) => {
    switch (id) {
      case 'salao':
        return <Scissors className="w-4 h-4" />;
      case 'barbearia':
        return <Scissors className="w-4 h-4 rotate-90" />;
      case 'clinica':
        return <Stethoscope className="w-4 h-4" />;
      case 'estetica':
        return <Sparkle className="w-4 h-4" />;
      case 'psicologia':
        return <Brain className="w-4 h-4" />;
      case 'petshop':
        return <Dog className="w-4 h-4" />;
      default:
        return <Briefcase className="w-4 h-4" />;
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end animate-fade-in print:hidden"
    >
      {/* Popover Menu with all Segments */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200/90 overflow-hidden animate-slide-in backdrop-blur-md">
          {/* Popover Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white/10 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">
                  Trocar Ramo do Negócio
                </h3>
                <p className="text-[11px] text-slate-300">
                  Selecione para ver termos, cores e dados reais
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Segment Items List */}
          <div className="p-2 max-h-[380px] overflow-y-auto divide-y divide-slate-100">
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
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all group ${
                    isSelected
                      ? 'bg-indigo-50/70 border border-indigo-200/80 shadow-2xs'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-2xs"
                      style={{
                        backgroundColor: isSelected ? d.colors.primary : d.colors.secondary,
                        color: isSelected ? '#FFFFFF' : d.colors.primary,
                      }}
                    >
                      {getSegmentIcon(d.id)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {d.business.name}
                        </span>
                        {isSelected && (
                          <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-indigo-600 text-white uppercase tracking-wider">
                            Ativo
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {d.business.category}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    {isSelected ? (
                      <Check className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <span
                        className="w-2.5 h-2.5 rounded-full block"
                        style={{ backgroundColor: d.colors.primary }}
                        title={`Cor: ${d.colors.primary}`}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-500">
              7 nichos pré-configurados prontos para demonstração
            </span>
          </div>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 pl-3 pr-3.5 py-2.5 rounded-full bg-slate-900 text-white shadow-xl hover:shadow-2xl hover:bg-slate-800 transition-all duration-200 border border-slate-700/60 active:scale-95"
        title="Clique para alternar o segmento do negócio"
      >
        <span
          className="w-3 h-3 rounded-full shrink-0 animate-pulse"
          style={{ backgroundColor: activeDemo.colors.primary }}
        />

        <div className="flex flex-col text-left">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider leading-none">
            Ramo Ativo
          </span>
          <span className="text-xs font-bold text-white truncate max-w-[150px] sm:max-w-[200px]">
            {activeDemo.business.name}
          </span>
        </div>

        <div className="p-1 rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors ml-1 text-slate-300">
          <ChevronUp
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>
    </div>
  );
};
