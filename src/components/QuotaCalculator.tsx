import { useState, useEffect } from 'react';
import { calculateQuotaConsumption, USD_TO_QUOTA, type QuotaCalculationResult } from '../lib/calculator';
import modelData from '../data/models.json';

const QuotaCalculator: React.FC = () => {
  const [inputTokens, setInputTokens] = useState<string>('1000');
  const [outputTokens, setOutputTokens] = useState<string>('500');
  const [modelRatio, setModelRatio] = useState<string>('0');
  const [completionRatio, setCompletionRatio] = useState<string>('0');
  const [groupRatio, setGroupRatio] = useState<string>('1');
  const [selectedModel, setSelectedModel] = useState<string>('');
  
  const [result, setResult] = useState<QuotaCalculationResult | null>(null);

  // 配额换算器状态
  const [quotaInput, setQuotaInput] = useState<string>('500000');
  const [usdInput, setUsdInput] = useState<string>('1');
  
  // 复制状态
  const [copied, setCopied] = useState<boolean>(false);

  // Initialize with first model
  useEffect(() => {
    if (modelData.models.length > 0 && !selectedModel) {
      handleModelSelect(modelData.models[0].id);
    }
  }, []);

  // 配额换算：当配额输入变化时更新美元
  const handleQuotaChange = (value: string) => {
    setQuotaInput(value);
    const quota = parseFloat(value) || 0;
    setUsdInput((quota / USD_TO_QUOTA).toFixed(6));
  };

  // 配额换算：当美元输入变化时更新配额
  const handleUsdChange = (value: string) => {
    setUsdInput(value);
    const usd = parseFloat(value) || 0;
    setQuotaInput(Math.round(usd * USD_TO_QUOTA).toString());
  };

  // 复制配额到剪贴板
  const copyQuota = () => {
    navigator.clipboard.writeText(quotaInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    const model = modelData.models.find(m => m.id === modelId);
    if (model) {
      setModelRatio(model.newApiRates.modelRatio.toString());
      setCompletionRatio(model.newApiRates.completionRatio.toString());
    }
  };

  useEffect(() => {
    const iTokens = parseFloat(inputTokens) || 0;
    const oTokens = parseFloat(outputTokens) || 0;
    const mRatio = parseFloat(modelRatio) || 0;
    const cRatio = parseFloat(completionRatio) || 0;
    const gRatio = parseFloat(groupRatio) || 1;

    setResult(calculateQuotaConsumption({
      inputTokens: iTokens,
      outputTokens: oTokens,
      modelRatio: mRatio,
      completionRatio: cRatio,
      groupRatio: gRatio
    }));
  }, [inputTokens, outputTokens, modelRatio, completionRatio, groupRatio]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Input Panel */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 3.666V14h-6v-3.334H9V14h6V7H9v3.666" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              参数配置
            </h3>
            
            <div className="w-48">
              <select
                value={selectedModel}
                onChange={(e) => handleModelSelect(e.target.value)}
                className="block w-full pl-3 pr-8 py-1.5 text-xs border border-gray-200 bg-gray-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg transition-colors cursor-pointer"
              >
                <option value="" disabled>快速选择模型...</option>
                {modelData.models.map((model) => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tokens */}
            <div className="space-y-4 md:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide group-focus-within:text-indigo-600 transition-colors">输入 Token 数</label>
                  <input
                    type="number"
                    value={inputTokens}
                    onChange={(e) => setInputTokens(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono shadow-sm"
                    placeholder="0"
                  />
                </div>
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide group-focus-within:text-indigo-600 transition-colors">输出 Token 数</label>
                  <input
                    type="number"
                    value={outputTokens}
                    onChange={(e) => setOutputTokens(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono shadow-sm"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Rates */}
            <div className="group">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide group-focus-within:text-blue-600 transition-colors">模型倍率</label>
              <input
                type="number"
                value={modelRatio}
                onChange={(e) => setModelRatio(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono shadow-sm"
                placeholder="0.00"
              />
            </div>
            
            <div className="group">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide group-focus-within:text-blue-600 transition-colors">补全倍率</label>
              <input
                type="number"
                value={completionRatio}
                onChange={(e) => setCompletionRatio(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono shadow-sm"
                placeholder="0.00"
              />
            </div>

            <div className="group md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide group-focus-within:text-purple-600 transition-colors">分组倍率</label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={groupRatio}
                  onChange={(e) => setGroupRatio(e.target.value)}
                  className="flex-1 bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-mono shadow-sm"
                  placeholder="1.00"
                />
                <div className="flex gap-2">
                  {[1, 1.5, 2, 3].map(r => (
                    <button
                      key={r}
                      onClick={() => setGroupRatio(r.toString())}
                      className={`px-3 py-1 text-xs rounded-md border font-medium transition-all ${
                        parseFloat(groupRatio) === r 
                          ? 'bg-purple-50 border-purple-200 text-purple-700' 
                          : 'bg-white border-gray-200 text-slate-500 hover:border-gray-300 hover:text-slate-700'
                      }`}
                    >
                      x{r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result Panel */}
      <div className="lg:col-span-5 space-y-6">
        {/* Main Result Card - Dark for contrast in light theme */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-indigo-600/30"></div>
          
          <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
            计算结果
          </h3>
          
          <div className="space-y-8 relative z-10">
            <div>
              <div className="text-slate-400 text-sm mb-1 font-medium">配额消耗点数</div>
              <div className="text-4xl font-bold text-white font-mono tracking-tight">
                {result ? result.quotaPoints.toLocaleString() : '0'}
              </div>
            </div>
            
            <div>
              <div className="text-slate-400 text-sm mb-1 font-medium">等价金额 (USD)</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono">
                ${result ? result.usdEquivalent.toFixed(6) : '0.000000'}
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">计算过程明细</h3>
          
          {result && (
            <div className="space-y-3 text-sm font-mono">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-slate-500">输入消耗 (x1)</span>
                <span className="text-slate-700 font-medium">{result.breakdown.inputCost.toFixed(4)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-slate-500">输出消耗 (x{completionRatio})</span>
                <span className="text-slate-700 font-medium">{result.breakdown.outputCost.toFixed(4)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-slate-500">基础总计</span>
                <span className="text-blue-600 font-medium">{result.breakdown.totalBeforeGroup.toFixed(4)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500">分组倍率 (x{groupRatio})</span>
                <span className="text-indigo-600 font-bold">{result.quotaPoints.toFixed(4)}</span>
              </div>
            </div>
          )}

          <div className="mt-6 bg-gray-50 rounded-lg p-3 text-xs text-slate-500 font-mono overflow-x-auto whitespace-nowrap border border-gray-100">
            (Input + Output × Completion) × Model × Group
          </div>
        </div>

        {/* 配额/美元换算器 */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200 shadow-sm">
          <h3 className="text-sm font-semibold text-emerald-800 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            配额/美元换算
            <span className="text-xs font-normal text-emerald-600 ml-auto">1 USD = 500,000 配额</span>
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-xs font-semibold text-emerald-600 mb-1.5 uppercase tracking-wide">配额点数</label>
              <div className="relative">
                <input
                  type="number"
                  value={quotaInput}
                  onChange={(e) => handleQuotaChange(e.target.value)}
                  className="w-full bg-white border border-emerald-200 rounded-lg py-2.5 px-3 pr-12 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono shadow-sm"
                  placeholder="500000"
                />
                <button
                  onClick={copyQuota}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-emerald-100 text-emerald-600 transition-colors"
                  title="复制配额值"
                >
                  {copied ? (
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <div className="group">
              <label className="block text-xs font-semibold text-emerald-600 mb-1.5 uppercase tracking-wide">美元 (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 font-medium">$</span>
                <input
                  type="number"
                  value={usdInput}
                  onChange={(e) => handleUsdChange(e.target.value)}
                  className="w-full bg-white border border-emerald-200 rounded-lg py-2.5 pl-7 pr-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono shadow-sm"
                  placeholder="1.00"
                  step="0.01"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {[1, 5, 10, 20, 50, 100].map(usd => (
              <button
                key={usd}
                onClick={() => handleUsdChange(usd.toString())}
                className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-all ${
                  parseFloat(usdInput) === usd
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                    : 'bg-white border-emerald-200 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                ${usd}
              </button>
            ))}
          </div>
          
          <p className="mt-3 text-xs text-emerald-600/80">
            💡 输入美元金额快速获取配额值，点击复制按钮可直接粘贴到 New API
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuotaCalculator;
