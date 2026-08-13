import React, { useState, useMemo } from 'react';
import { Calculator, Info, CheckCircle2 } from 'lucide-react';
import { formatCurrency, calculateFinancing } from '../utils/formatters';

interface FinancingSimulatorProps {
  vehiclePrice: number;
  onApplySimulation?: (downPayment: number, installments: number) => void;
}

export const FinancingSimulator: React.FC<FinancingSimulatorProps> = ({
  vehiclePrice,
  onApplySimulation,
}) => {
  const [downPayment, setDownPayment] = useState<number>(Math.round(vehiclePrice * 0.3)); // 30% initial default
  const [installments, setInstallments] = useState<number>(48);
  const [interestRate, setInterestRate] = useState<number>(1.49);

  const installmentOptions = [12, 24, 36, 48, 60, 72];

  const result = useMemo(() => {
    return calculateFinancing(vehiclePrice, downPayment, installments, interestRate);
  }, [vehiclePrice, downPayment, installments, interestRate]);

  const downPaymentPercent = Math.round((downPayment / vehiclePrice) * 100);

  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setDownPayment(Math.min(Math.max(0, val), vehiclePrice));
  };

  return (
    <div className="bg-[#0A0A0C] border border-[#1F1F24] rounded-2xl p-6 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#1F1F24]">
        <div className="p-2.5 rounded-xl bg-[#E11D48]/10 border border-[#E11D48]/30 text-[#E11D48]">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-lg text-white">Simulador de Financiamento</h3>
          <p className="text-xs text-gray-400">Calcule parcelas estimadas para este veículo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Controls Column */}
        <div className="space-y-5">
          
          {/* Vehicle Price Display */}
          <div className="flex justify-between items-center bg-[#141418] p-3.5 rounded-xl border border-[#1F1F24]">
            <span className="text-xs text-gray-400 font-medium">Valor do Veículo</span>
            <span className="text-sm font-bold text-white font-mono">{formatCurrency(vehiclePrice)}</span>
          </div>

          {/* Down Payment Input & Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-300 font-semibold">Valor da Entrada</span>
              <span className="text-[#E11D48] font-bold font-mono">
                {formatCurrency(downPayment)} ({downPaymentPercent}%)
              </span>
            </div>
            
            <input
              type="range"
              min={0}
              max={vehiclePrice}
              step={1000}
              value={downPayment}
              onChange={handleDownPaymentChange}
              className="w-full h-2 bg-[#1F1F24] rounded-lg appearance-none cursor-pointer accent-[#E11D48]"
            />

            {/* Quick percentage buttons */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[20, 30, 40, 50].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setDownPayment(Math.round((vehiclePrice * pct) / 100))}
                  className={`py-1 rounded-lg text-[11px] font-medium border transition-all ${
                    downPaymentPercent === pct
                      ? 'bg-[#E11D48] border-[#E11D48] text-white'
                      : 'bg-[#141418] border-[#2A2A32] text-gray-400 hover:text-white'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Number of Installments */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300">
              Número de Parcelas
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {installmentOptions.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setInstallments(n)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    installments === n
                      ? 'bg-[#E11D48] border-[#E11D48] text-white shadow-[0_0_12px_rgba(225,29,72,0.4)]'
                      : 'bg-[#141418] border-[#2A2A32] text-gray-400 hover:text-white'
                  }`}
                >
                  {n}x
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate Selector */}
          <div className="flex items-center justify-between text-xs bg-[#141418] p-3 rounded-xl border border-[#1F1F24]">
            <span className="text-gray-400">Taxa Estimada a.m.:</span>
            <select
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="bg-[#0A0A0C] border border-[#2A2A32] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#E11D48]"
            >
              <option value="1.19">1,19% a.m. (Excelente Score)</option>
              <option value="1.49">1,49% a.m. (Padrão de Mercado)</option>
              <option value="1.89">1,89% a.m. (Flexível)</option>
            </select>
          </div>

        </div>

        {/* Results Summary Column */}
        <div className="flex flex-col justify-between bg-gradient-to-b from-[#141418] to-[#0D0D10] border border-[#2A2A32] p-5 rounded-2xl">
          
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-gray-400 block">
              Resultado da Simulação
            </span>

            {/* Big Installment Highlight */}
            <div className="bg-[#030303] border border-[#1F1F24] p-4 rounded-xl text-center space-y-1">
              <span className="text-xs text-gray-400">{installments}x parcelas de aproximadamente</span>
              <div className="text-3xl font-extrabold font-heading text-[#E11D48] tracking-tight">
                {formatCurrency(result.monthlyPayment)}
              </div>
              <span className="text-[10px] text-gray-500 font-mono">1ª parcela em 30 a 60 dias</span>
            </div>

            {/* Breakdown */}
            <div className="space-y-2 text-xs border-t border-[#1F1F24] pt-3">
              <div className="flex justify-between text-gray-300">
                <span>Valor Financiado:</span>
                <span className="font-semibold text-white font-mono">{formatCurrency(result.financedAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Total Financiado (com juros):</span>
                <span className="font-semibold text-white font-mono">{formatCurrency(result.totalFinanced)}</span>
              </div>
            </div>
          </div>

          {/* Action / Apply */}
          <div className="mt-5 pt-3 border-t border-[#1F1F24] space-y-3">
            {onApplySimulation && (
              <button
                type="button"
                onClick={() => onApplySimulation(downPayment, installments)}
                className="w-full py-2.5 rounded-xl bg-[#E11D48] hover:bg-[#F43F5E] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Usar estes valores na proposta</span>
              </button>
            )}

            {/* Mandatory Disclaimer */}
            <p className="text-[10px] text-gray-500 leading-relaxed flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
              <span>
                Simulação aproximada. As condições reais dependem da análise da instituição financeira.
              </span>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
