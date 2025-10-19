export type CalculationType = "tqqq-investment" | "upro-investment";

export interface CalculationInput {
  type: CalculationType;
  cashBalance: number;
  assetPrice: number;
  underlyingAssetPrice: number;
  underlyingAsset200MaPrice: number;
}

export interface CalculationResult {
  type: CalculationType;
  finalInvestment: number;
}

export function calculate(input: CalculationInput): CalculationResult {
  const portfolioScaleFactor = Math.max(1, Math.floor(input.cashBalance / 250));

  const distance =
    (input.underlyingAssetPrice - input.underlyingAsset200MaPrice) /
    input.underlyingAsset200MaPrice;

  const sensitivity = 5;
  let distanceScaleFactor = 1;
  if (distance > 0) distanceScaleFactor = 1 / (1 + sensitivity * distance);
  else distanceScaleFactor = 1 + sensitivity * Math.abs(distance);

  const finalInvestment =
    input.assetPrice * portfolioScaleFactor * distanceScaleFactor;

  return {
    type: input.type,
    finalInvestment,
  };
}

/**
 * Format calculation result for display
 */
export function formatResult(result: CalculationResult): string {
  return `${
    result.type
  } investment amount: $${result.finalInvestment.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
