/**
 * 从 models.dev 获取模型价格数据并转换为 JSON
 * 用于构建时预处理数据
 */

import * as fs from 'fs';
import * as path from 'path';
import * as TOML from '@iarna/toml';

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/anomalyco/models.dev/dev';
const GITHUB_API_BASE = 'https://api.github.com/repos/anomalyco/models.dev';

// 主流提供商列表（优先获取这些）
const PRIORITY_PROVIDERS = [
  'openai',
  'anthropic', 
  'google',
  'deepseek',
  'meta',
  'mistral',
  'cohere',
  'alibaba',
  'moonshot',
  'zhipu',
  'baichuan',
  'minimax',
  'bytedance',
  '01-ai',
  'xai',
  'amazon',
];

interface ModelCost {
  input?: number;
  output?: number;
  cache_read?: number;
  cache_write?: number;
  reasoning?: number;
  input_audio?: number;
  output_audio?: number;
}

interface ModelLimit {
  context?: number;
  output?: number;
}

interface RawModelData {
  name?: string;
  family?: string;
  cost?: ModelCost;
  limit?: ModelLimit;
  modalities?: string[];
}

export interface ModelData {
  id: string;
  name: string;
  provider: string;
  family?: string;
  cost: {
    input: number;
    output: number;
    cacheRead?: number;
    cacheWrite?: number;
    reasoning?: number;
  };
  limits?: {
    context?: number;
    output?: number;
  };
  modalities?: string[];
  // 计算后的 new-api 倍率
  newApiRates: {
    modelRatio: number;
    completionRatio: number;
  };
}

/**
 * 计算 new-api 倍率
 * 公式：
 * - 模型倍率 = 官方输入价格($/1M) × 0.5
 * - 补全倍率 = 输出价格 / 输入价格
 */
function calculateNewApiRates(cost: ModelCost): { modelRatio: number; completionRatio: number } {
  const input = cost.input || 0;
  const output = cost.output || 0;
  
  // 模型倍率 = 输入价格($/1M tokens) × 0.5
  // 因为 1 美元 = 500,000 配额，所以 $1/1M tokens = 0.5 倍率
  const modelRatio = input * 0.5;
  
  // 补全倍率 = 输出价格 / 输入价格
  // 如果输入价格为 0，默认补全倍率为 1
  const completionRatio = input > 0 ? output / input : 1;
  
  return {
    modelRatio: Math.round(modelRatio * 10000) / 10000,
    completionRatio: Math.round(completionRatio * 10000) / 10000,
  };
}

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      if (response.status === 404) throw new Error('Not found');
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
}

async function getProviderModels(provider: string): Promise<string[]> {
  try {
    const url = `${GITHUB_API_BASE}/contents/providers/${provider}/models`;
    const response = await fetchWithRetry(url);
    const files = await response.json() as Array<{ name: string }>;
    return files
      .filter(f => f.name.endsWith('.toml'))
      .map(f => f.name.replace('.toml', ''));
  } catch {
    console.error(`Failed to get models for ${provider}`);
    return [];
  }
}

async function fetchModelData(provider: string, modelId: string): Promise<ModelData | null> {
  try {
    const url = `${GITHUB_RAW_BASE}/providers/${provider}/models/${modelId}.toml`;
    const response = await fetchWithRetry(url);
    const tomlText = await response.text();
    const data = TOML.parse(tomlText) as RawModelData;
    
    if (!data.cost?.input && !data.cost?.output) {
      return null;
    }

    const cost = {
      input: data.cost?.input || 0,
      output: data.cost?.output || 0,
      cacheRead: data.cost?.cache_read,
      cacheWrite: data.cost?.cache_write,
      reasoning: data.cost?.reasoning,
    };

    return {
      id: modelId,
      name: data.name || modelId,
      provider,
      family: data.family,
      cost,
      limits: data.limit ? {
        context: data.limit.context,
        output: data.limit.output,
      } : undefined,
      modalities: data.modalities,
      newApiRates: calculateNewApiRates(data.cost || {}),
    };
  } catch (error) {
    console.error(`Failed to fetch ${provider}/${modelId}:`, error);
    return null;
  }
}

async function main() {
  console.log('🚀 开始获取模型数据...');
  
  const allModels: ModelData[] = [];
  
  for (const provider of PRIORITY_PROVIDERS) {
    console.log(`\n📦 处理提供商: ${provider}`);
    const modelIds = await getProviderModels(provider);
    console.log(`   找到 ${modelIds.length} 个模型`);
    
    // 批量获取，每批 10 个
    for (let i = 0; i < modelIds.length; i += 10) {
      const batch = modelIds.slice(i, i + 10);
      const results = await Promise.all(
        batch.map(id => fetchModelData(provider, id))
      );
      
      results.forEach(model => {
        if (model) allModels.push(model);
      });
      
      // 避免请求过快
      if (i + 10 < modelIds.length) {
        await new Promise(r => setTimeout(r, 500));
      }
    }
  }

  console.log(`\n✅ 共获取 ${allModels.length} 个模型数据`);

  // 按提供商分组
  const byProvider: Record<string, ModelData[]> = {};
  allModels.forEach(model => {
    if (!byProvider[model.provider]) {
      byProvider[model.provider] = [];
    }
    byProvider[model.provider].push(model);
  });

  // 写入文件
  const outputPath = path.join(process.cwd(), 'src/data/models.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify({
    updatedAt: new Date().toISOString(),
    providers: Object.keys(byProvider).sort(),
    models: allModels,
    byProvider,
  }, null, 2));

  console.log(`📝 数据已写入: ${outputPath}`);
}

main().catch(console.error);
