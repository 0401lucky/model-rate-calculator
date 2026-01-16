/**
 * New API 倍率计算工具
 * 
 * 公式说明（来自 new-api 官方文档）：
 * 
 * 按量计费模型：
 *   配额消耗 = (输入token + 输出token × 补全倍率) × 模型倍率 × 分组倍率
 * 
 * 换算关系：
 *   1 美元 = 500,000 配额点数
 *   模型倍率 = 官方输入价格($/1M tokens) × 0.5
 *   补全倍率 = 输出价格 / 输入价格
 */

export interface PricingInput {
  /** 官方输入价格 ($/1M tokens) */
  inputPrice: number;
  /** 官方输出价格 ($/1M tokens) */
  outputPrice: number;
}

export interface NewApiRates {
  /** 模型倍率 */
  modelRatio: number;
  /** 补全倍率 */
  completionRatio: number;
}

export interface QuotaCalculationInput {
  /** 输入 token 数量 */
  inputTokens: number;
  /** 输出 token 数量 */
  outputTokens: number;
  /** 模型倍率 */
  modelRatio: number;
  /** 补全倍率 */
  completionRatio: number;
  /** 分组倍率（默认 1） */
  groupRatio?: number;
}

export interface QuotaCalculationResult {
  /** 配额消耗点数 */
  quotaPoints: number;
  /** 等价美元 */
  usdEquivalent: number;
  /** 计算明细 */
  breakdown: {
    inputCost: number;
    outputCost: number;
    totalBeforeGroup: number;
  };
}

/** 1 美元 = 500,000 配额点数 */
export const USD_TO_QUOTA = 500_000;

/**
 * 从官方价格计算 new-api 倍率
 */
export function calculateRatesFromPricing(pricing: PricingInput): NewApiRates {
  const { inputPrice, outputPrice } = pricing;
  
  // 模型倍率 = 输入价格($/1M) × 0.5
  // 原理：1美元=500,000配额，1M tokens价格inputPrice美元 → 1K tokens消耗 inputPrice×500 配额
  // 而 new-api 中 1K tokens 消耗 = 模型倍率，所以模型倍率 = inputPrice × 500 / 1000 = inputPrice × 0.5
  const modelRatio = inputPrice * 0.5;
  
  // 补全倍率 = 输出价格 / 输入价格
  const completionRatio = inputPrice > 0 ? outputPrice / inputPrice : 1;
  
  return {
    modelRatio: roundTo4Decimals(modelRatio),
    completionRatio: roundTo4Decimals(completionRatio),
  };
}

/**
 * 从 new-api 倍率反推官方价格
 */
export function calculatePricingFromRates(rates: NewApiRates): PricingInput {
  const { modelRatio, completionRatio } = rates;
  
  // 输入价格 = 模型倍率 / 0.5
  const inputPrice = modelRatio / 0.5;
  
  // 输出价格 = 输入价格 × 补全倍率
  const outputPrice = inputPrice * completionRatio;
  
  return {
    inputPrice: roundTo4Decimals(inputPrice),
    outputPrice: roundTo4Decimals(outputPrice),
  };
}

/**
 * 计算配额消耗
 */
export function calculateQuotaConsumption(input: QuotaCalculationInput): QuotaCalculationResult {
  const { inputTokens, outputTokens, modelRatio, completionRatio, groupRatio = 1 } = input;
  
  // 公式：(输入token + 输出token × 补全倍率) × 模型倍率 × 分组倍率
  // 注意：token 数量需要除以 1000，因为倍率是按 1K tokens 计算的
  const inputCost = (inputTokens / 1000) * modelRatio;
  const outputCost = (outputTokens / 1000) * modelRatio * completionRatio;
  const totalBeforeGroup = inputCost + outputCost;
  const quotaPoints = totalBeforeGroup * groupRatio;
  
  // 转换为等价美元
  const usdEquivalent = quotaPoints / USD_TO_QUOTA;
  
  return {
    quotaPoints: roundTo4Decimals(quotaPoints),
    usdEquivalent: roundTo6Decimals(usdEquivalent),
    breakdown: {
      inputCost: roundTo4Decimals(inputCost),
      outputCost: roundTo4Decimals(outputCost),
      totalBeforeGroup: roundTo4Decimals(totalBeforeGroup),
    },
  };
}

/**
 * 计算使用给定预算能消耗的 token 数量
 */
export function calculateTokensFromBudget(
  budgetUsd: number,
  modelRatio: number,
  completionRatio: number,
  inputOutputRatio: number = 0.5, // 输入占比，默认 50%
  groupRatio: number = 1
): { inputTokens: number; outputTokens: number; totalTokens: number } {
  // 预算转换为配额
  const budgetQuota = budgetUsd * USD_TO_QUOTA;
  
  // 设 总token = T, 输入 = T × r, 输出 = T × (1-r)
  // 配额 = (T×r/1000 + T×(1-r)/1000 × completionRatio) × modelRatio × groupRatio
  // 配额 = T/1000 × (r + (1-r) × completionRatio) × modelRatio × groupRatio
  
  const r = inputOutputRatio;
  const costPerToken = (r + (1 - r) * completionRatio) * modelRatio * groupRatio / 1000;
  
  const totalTokens = budgetQuota / costPerToken;
  const inputTokens = totalTokens * r;
  const outputTokens = totalTokens * (1 - r);
  
  return {
    inputTokens: Math.floor(inputTokens),
    outputTokens: Math.floor(outputTokens),
    totalTokens: Math.floor(totalTokens),
  };
}

function roundTo4Decimals(n: number): number {
  return Math.round(n * 10000) / 10000;
}

function roundTo6Decimals(n: number): number {
  return Math.round(n * 1000000) / 1000000;
}
