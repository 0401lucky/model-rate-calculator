import { useState } from 'react';
import ModelRateLookup from './components/ModelRateLookup';
import QuotaCalculator from './components/QuotaCalculator';
import RateConverter from './components/RateConverter';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  const [activeTab, setActiveTab] = useState<'lookup' | 'calculator'>('lookup');

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-700 font-sans">
      {/* Background Ambience - Subtle Light Mode */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent opacity-80"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-100/40 rounded-full blur-[100px] mix-blend-multiply"></div>
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[100px] mix-blend-multiply"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <header className="mb-12 text-center md:text-left md:flex md:justify-between md:items-end">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">New API</span> 
              模型计算器
            </h1>
            <p className="text-slate-500 text-sm md:text-base max-w-2xl">
              一站式计算 New API / One API 的模型倍率、配额消耗及成本预估工具。
            </p>
          </div>
          
          <div className="mt-6 md:mt-0 flex gap-2 justify-center md:justify-end">
             <a href="https://github.com/songquanpeng/new-api" target="_blank" rel="noopener noreferrer" 
               className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-full text-xs font-medium text-slate-600 bg-white hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
               <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
               GitHub
             </a>
          </div>
        </header>

        {/* Converter Widget - Always visible but compact */}
        <div className="mb-10">
          <RateConverter />
        </div>

        {/* Main Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl border border-gray-200 max-w-md mx-auto md:mx-0">
            <button
              onClick={() => setActiveTab('lookup')}
              className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === 'lookup'
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-gray-200/50'
              }`}
            >
              模型倍率查询
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === 'calculator'
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-gray-200/50'
              }`}
            >
              配额计算器
            </button>
          </div>
        </div>

        {/* Content Area */}
        <ErrorBoundary>
          <div className="min-h-[500px]">
            {activeTab === 'lookup' ? (
              <ModelRateLookup />
            ) : (
              <QuotaCalculator />
            )}
          </div>
        </ErrorBoundary>

        {/* Footer */}
        <footer className="mt-20 border-t border-gray-200 pt-8 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Model Rate Calculator. Design for Developers.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
