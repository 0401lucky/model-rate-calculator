import { useState, useMemo, memo } from 'react';
import modelData from '../data/models.json';
import { useDebounce } from '../hooks/useDebounce';

interface Model {
  id: string;
  name: string;
  provider: string;
  cost: { input: number; output: number; };
  newApiRates: { modelRatio: number; completionRatio: number; };
}

// 提取表格行组件并使用 memo 优化
const ModelTableRow = memo(({ model }: { model: Model }) => (
  <tr className="hover:bg-gray-50/80 transition-colors group">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="text-sm font-medium text-slate-900 group-hover:text-indigo-700 transition-colors">{model.name}</div>
      </div>
      <div className="text-xs text-slate-500 font-mono mt-0.5">{model.id}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <ProviderBadge provider={model.provider} />
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-500 font-mono">
      <div>In: <span className="text-slate-700 font-medium">${model.cost.input.toFixed(2)}</span></div>
      <div>Out: <span className="text-slate-700 font-medium">${model.cost.output.toFixed(2)}</span></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-indigo-600 font-mono bg-indigo-50/50">
      {model.newApiRates.modelRatio.toFixed(2)}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-blue-600 font-mono bg-blue-50/50">
      {model.newApiRates.completionRatio.toFixed(2)}
    </td>
  </tr>
));
ModelTableRow.displayName = 'ModelTableRow';

// 提取移动端卡片组件并使用 memo 优化
const ModelCard = memo(({ model }: { model: Model }) => (
  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{model.name}</h3>
        <p className="text-xs text-slate-500 font-mono">{model.id}</p>
      </div>
      <ProviderBadge provider={model.provider} size="small" />
    </div>
    
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
        <div className="text-slate-400 text-xs mb-1 uppercase font-bold">官方价格 ($/1M)</div>
        <div className="flex justify-between font-mono text-slate-700 text-xs">
          <span>In:</span> <span className="font-semibold">${model.cost.input.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-mono text-slate-700 text-xs">
          <span>Out:</span> <span className="font-semibold">${model.cost.output.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-100 flex justify-between items-center">
          <span className="text-xs text-indigo-700 font-medium">模型倍率</span>
          <span className="font-bold text-indigo-700 font-mono">{model.newApiRates.modelRatio.toFixed(2)}</span>
        </div>
        <div className="bg-blue-50 p-2 rounded-lg border border-blue-100 flex justify-between items-center">
          <span className="text-xs text-blue-700 font-medium">补全倍率</span>
          <span className="font-bold text-blue-700 font-mono">{model.newApiRates.completionRatio.toFixed(2)}</span>
        </div>
      </div>
    </div>
  </div>
));
ModelCard.displayName = 'ModelCard';

// 提取 Provider Badge 组件
const ProviderBadge = memo(({ provider, size = 'normal' }: { provider: string; size?: 'small' | 'normal' }) => {
  const colorClasses = 
    provider === 'OpenAI' ? 'bg-green-50 text-green-700 border-green-200' : 
    provider === 'Anthropic' ? 'bg-purple-50 text-purple-700 border-purple-200' :
    provider === 'Google' ? 'bg-blue-50 text-blue-700 border-blue-200' :
    'bg-gray-100 text-slate-700 border-gray-200';
  
  const sizeClasses = size === 'small' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs leading-5';
  
  return (
    <span className={`${sizeClasses} inline-flex font-medium rounded-full border ${colorClasses}`}>
      {provider}
    </span>
  );
});
ProviderBadge.displayName = 'ProviderBadge';

const ModelRateLookup: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('All');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'newApiRates.modelRatio', direction: 'desc' });

  // 防抖处理搜索词，避免频繁过滤
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const providers = ['All', ...modelData.providers];

  const filteredModels = useMemo(() => {
    return modelData.models.filter(model => {
      const matchesSearch = model.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
                          model.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesProvider = selectedProvider === 'All' || model.provider === selectedProvider;
      return matchesSearch && matchesProvider;
    }).sort((a, b) => {
      const getSortValue = (model: Model): number | string => {
        switch (sortConfig.key) {
          case 'cost.input':
            return model.cost.input;
          case 'newApiRates.modelRatio':
            return model.newApiRates.modelRatio;
          case 'newApiRates.completionRatio':
            return model.newApiRates.completionRatio;
          case 'name':
            return model.name;
          case 'provider':
            return model.provider;
          default:
            return model.name;
        }
      };

      const aValue = getSortValue(a);
      const bValue = getSortValue(b);

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [debouncedSearchTerm, selectedProvider, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key: key as any,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIcon = ({ active, direction }: { active: boolean, direction: 'asc' | 'desc' }) => (
    <span className={`inline-block ml-1 transition-opacity ${active ? 'opacity-100 text-indigo-600' : 'opacity-20 text-slate-400'}`}>
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
            placeholder="搜索模型名称 (例如: gpt-4, claude...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-shrink-0 w-full md:w-48">
          <div className="relative">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="block w-full pl-3 pr-10 py-3 text-base border border-gray-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm rounded-xl appearance-none cursor-pointer hover:bg-gray-50 transition-all shadow-sm"
            >
              {providers.map((provider) => (
                <option key={provider} value={provider}>{provider}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 transition-colors"
                onClick={() => handleSort('name')}
              >
                模型名称 <SortIcon active={sortConfig.key === 'name'} direction={sortConfig.direction} />
              </th>
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 transition-colors"
                onClick={() => handleSort('provider')}
              >
                提供商 <SortIcon active={sortConfig.key === 'provider'} direction={sortConfig.direction} />
              </th>
              <th 
                scope="col" 
                className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 transition-colors"
                onClick={() => handleSort('cost.input')}
              >
                官方价格 ($/1M) <SortIcon active={sortConfig.key === 'cost.input'} direction={sortConfig.direction} />
              </th>
              <th 
                scope="col" 
                className="px-6 py-4 text-right text-xs font-semibold text-indigo-600 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors"
                onClick={() => handleSort('newApiRates.modelRatio')}
              >
                模型倍率 <SortIcon active={sortConfig.key === 'newApiRates.modelRatio'} direction={sortConfig.direction} />
              </th>
              <th 
                scope="col" 
                className="px-6 py-4 text-right text-xs font-semibold text-blue-600 uppercase tracking-wider cursor-pointer hover:text-blue-700 transition-colors"
                onClick={() => handleSort('newApiRates.completionRatio')}
              >
                补全倍率 <SortIcon active={sortConfig.key === 'newApiRates.completionRatio'} direction={sortConfig.direction} />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredModels.map((model) => (
              <ModelTableRow key={model.id} model={model} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredModels.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>
      
      {filteredModels.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <svg className="mx-auto h-12 w-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>未找到匹配的模型</p>
        </div>
      )}
    </div>
  );
};

export default ModelRateLookup;
