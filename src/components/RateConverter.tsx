import { useState, useEffect } from 'react';
import { calculateRatesFromPricing, calculatePricingFromRates } from '../lib/calculator';

const RateConverter: React.FC = () => {
  const [inputPrice, setInputPrice] = useState<string>('10.00');
  const [outputPrice, setOutputPrice] = useState<string>('30.00');
  const [modelRatio, setModelRatio] = useState<string>('5.0000');
  const [completionRatio, setCompletionRatio] = useState<string>('3.0000');
  
  const [lastEdited, setLastEdited] = useState<'price' | 'rate'>('price');

  // Update rates when prices change
  const handlePriceChange = (field: 'input' | 'output', value: string) => {
    setLastEdited('price');
    if (field === 'input') setInputPrice(value);
    else setOutputPrice(value);
  };

  // Update prices when rates change
  const handleRateChange = (field: 'model' | 'completion', value: string) => {
    setLastEdited('rate');
    if (field === 'model') setModelRatio(value);
    else setCompletionRatio(value);
  };

  useEffect(() => {
    if (lastEdited === 'price') {
      const iPrice = parseFloat(inputPrice) || 0;
      const oPrice = parseFloat(outputPrice) || 0;
      const rates = calculateRatesFromPricing({ inputPrice: iPrice, outputPrice: oPrice });
      setModelRatio(rates.modelRatio.toString());
      setCompletionRatio(rates.completionRatio.toString());
    }
  }, [inputPrice, outputPrice, lastEdited]);

  useEffect(() => {
    if (lastEdited === 'rate') {
      const mRatio = parseFloat(modelRatio) || 0;
      const cRatio = parseFloat(completionRatio) || 0;
      const pricing = calculatePricingFromRates({ modelRatio: mRatio, completionRatio: cRatio });
      setInputPrice(pricing.inputPrice.toString());
      setOutputPrice(pricing.outputPrice.toString());
    }
  }, [modelRatio, completionRatio, lastEdited]);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        倍率换算工具
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        {/* Divider for desktop */}
        <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 bg-white p-2 rounded-full border border-gray-200 z-10">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>

        {/* Official Pricing */}
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">官方价格 ($/1M Tokens)</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-xs font-medium text-slate-500 mb-1 group-focus-within:text-indigo-600 transition-colors">输入 Input</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-medium">$</span>
                <input
                  type="number"
                  value={inputPrice}
                  onChange={(e) => handlePriceChange('input', e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-7 pr-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="group">
              <label className="block text-xs font-medium text-slate-500 mb-1 group-focus-within:text-indigo-600 transition-colors">输出 Output</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-medium">$</span>
                <input
                  type="number"
                  value={outputPrice}
                  onChange={(e) => handlePriceChange('output', e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-7 pr-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>

        {/* New API Rates */}
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">New API 倍率设置</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-xs font-medium text-slate-500 mb-1 group-focus-within:text-blue-600 transition-colors">模型倍率</label>
              <input
                type="number"
                value={modelRatio}
                onChange={(e) => handleRateChange('model', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                placeholder="0.00"
              />
            </div>
            <div className="group">
              <label className="block text-xs font-medium text-slate-500 mb-1 group-focus-within:text-blue-600 transition-colors">补全倍率</label>
              <input
                type="number"
                value={completionRatio}
                onChange={(e) => handleRateChange('completion', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateConverter;
