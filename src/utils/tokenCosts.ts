import pricingData from "../config/openai-pricing.json";

// Get all text model names from the pricing data
type OpenAIModel =
  | (typeof pricingData.text_tokens)[number]["model"]
  | (typeof pricingData.other_models)[number]["model"];

interface TokenCosts {
  inputTokens: number;
  outputTokens: number;
  model: OpenAIModel;
}

interface ModelPricing {
  input_cost_per_million: number;
  output_cost_per_million: number;
  cached_input_cost_per_million?: number;
}

function findModelPricing(model: OpenAIModel): ModelPricing | undefined {
  // Search in text_tokens
  const textModel = pricingData.text_tokens.find((m) => m.model === model);
  if (textModel) return textModel;

  // Search in other_models
  const otherModel = pricingData.other_models.find((m) => m.model === model);
  if (otherModel) return otherModel;

  return undefined;
}

export function calculateTokenCosts({
  inputTokens,
  outputTokens,
  model,
}: TokenCosts) {
  const modelPricing = findModelPricing(model);
  if (!modelPricing) {
    throw new Error(`Unknown model: ${model}`);
  }

  const inputCost =
    (inputTokens * modelPricing.input_cost_per_million) / 1_000_000;
  const outputCost =
    (outputTokens * modelPricing.output_cost_per_million) / 1_000_000;

  return {
    inputTokens,
    inputCostPerToken: modelPricing.input_cost_per_million / 1_000_000,
    inputTotalCost: inputCost,
    outputTokens,
    outputCostPerToken: modelPricing.output_cost_per_million / 1_000_000,
    outputTotalCost: outputCost,
    totalTokens: inputTokens + outputTokens,
    totalCost: inputCost + outputCost,
    model,
    hasCachedPricing: !!modelPricing.cached_input_cost_per_million,
    cachedInputCostPerToken: modelPricing.cached_input_cost_per_million
      ? modelPricing.cached_input_cost_per_million / 1_000_000
      : undefined,
  };
}

// Example usage:
// const costs = calculateTokenCosts({
//   inputTokens: 100,
//   outputTokens: 250,
//   model: "gpt-4-turbo-2024-04-09"
// });
