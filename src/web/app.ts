// Inline calculator logic to avoid module loading issues with file:// protocol
function calculate(input: {
  type: string;
  cashBalance: number;
  assetPrice: number;
  underlyingAssetPrice: number;
  underlyingAsset200MaPrice: number;
}) {
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
    portfolioScaleFactor,
    distance,
    distanceScaleFactor,
  };
}

const form = document.getElementById("calculatorForm") as HTMLFormElement;
const resultDiv = document.getElementById("result") as HTMLDivElement;

console.log("Script loaded successfully");

form.addEventListener("submit", (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
  console.log("Form submitted, event prevented");

  const formData = new FormData(form);
  const cashBalance = parseFloat(formData.get("cashBalance") as string);

  // TQQQ inputs
  const tqqqAmount = parseFloat(formData.get("tqqqAmount") as string);
  const qqqPrice = parseFloat(formData.get("qqqPrice") as string);
  const qqq200Ma = parseFloat(formData.get("qqq200Ma") as string);

  // UPRO inputs
  const uproAmount = parseFloat(formData.get("uproAmount") as string);
  const vooPrice = parseFloat(formData.get("vooPrice") as string);
  const voo200Ma = parseFloat(formData.get("voo200Ma") as string);

  // Validate inputs
  const allInputs = [
    cashBalance,
    tqqqAmount,
    qqqPrice,
    qqq200Ma,
    uproAmount,
    vooPrice,
    voo200Ma,
  ];

  if (allInputs.some((val) => isNaN(val))) {
    resultDiv.innerHTML =
      "<p>Error: Please enter valid numbers in all fields</p>";
    return false;
  }

  if (allInputs.some((val) => val <= 0)) {
    resultDiv.innerHTML = "<p>Error: All values must be greater than zero</p>";
    return false;
  }

  // Calculate TQQQ
  const tqqqInput = {
    type: "tqqq-investment",
    assetPrice: tqqqAmount,
    cashBalance,
    underlyingAssetPrice: qqqPrice,
    underlyingAsset200MaPrice: qqq200Ma,
  };

  // Calculate UPRO
  const uproInput = {
    type: "upro-investment",
    assetPrice: uproAmount,
    cashBalance,
    underlyingAssetPrice: vooPrice,
    underlyingAsset200MaPrice: voo200Ma,
  };

  console.log("TQQQ Input:", tqqqInput);
  console.log("UPRO Input:", uproInput);

  const tqqqResult = calculate(tqqqInput);
  const uproResult = calculate(uproInput);

  console.log("TQQQ Result:", tqqqResult);
  console.log("UPRO Result:", uproResult);

  const tqqqDistancePercent = (tqqqResult.distance * 100).toFixed(2);
  const uproDistancePercent = (uproResult.distance * 100).toFixed(2);

  resultDiv.innerHTML = `
    <h2>Results</h2>
    <p><strong>Cash Balance:</strong> $${cashBalance.toFixed(2)}</p>
    <p><strong>Portfolio Scale Factor:</strong> ${
      tqqqResult.portfolioScaleFactor
    }x</p>
    
    <h3>TQQQ Investment</h3>
    <p><strong>TQQQ Amount Used:</strong> $${tqqqAmount}</p>
    <p><strong>Recommended Investment Amount:</strong> $${tqqqResult.finalInvestment.toFixed(
      2
    )}</p>
    <p><strong>QQQ Distance from 200MA:</strong> ${tqqqDistancePercent}%</p>
    <p><strong>Market Position:</strong> ${
      tqqqResult.distance > 0
        ? "Above 200MA (reducing investment)"
        : "Below 200MA (increasing investment)"
    }</p>
    
    <h3>UPRO Investment</h3>
    <p><strong>UPRO Amount Used:</strong> $${uproAmount}</p>
    <p><strong>Recommended Investment Amount:</strong> $${uproResult.finalInvestment.toFixed(
      2
    )}</p>
    <p><strong>VOO Distance from 200MA:</strong> ${uproDistancePercent}%</p>
    <p><strong>Market Position:</strong> ${
      uproResult.distance > 0
        ? "Above 200MA (reducing investment)"
        : "Below 200MA (increasing investment)"
    }</p>
  `;

  console.log("Results displayed successfully");

  return false;
});

// Tax Bracket Calculator
const taxCalculateButton = document.getElementById("taxCalculateButton") as HTMLButtonElement;
const taxResultDiv = document.getElementById("taxResult") as HTMLDivElement;
const taxBracketSelect = document.getElementById("taxBracket") as HTMLSelectElement;
const ytdEarningsInput = document.getElementById("ytdEarnings") as HTMLInputElement;
const stockPriceInput = document.getElementById("stockPrice") as HTMLInputElement;

taxCalculateButton.addEventListener("click", () => {
  const taxBracketValue = parseFloat(taxBracketSelect.value);
  const ytdEarnings = parseFloat(ytdEarningsInput.value);
  const stockPrice = parseFloat(stockPriceInput.value);

  // Validate inputs
  if (isNaN(taxBracketValue) || isNaN(ytdEarnings) || isNaN(stockPrice)) {
    taxResultDiv.innerHTML = "<p>Error: Please enter valid numbers</p>";
    return;
  }

  if (stockPrice <= 0) {
    taxResultDiv.innerHTML = "<p>Error: Stock Price must be greater than zero</p>";
    return;
  }

  // Handle negative YTD earnings
  if (ytdEarnings <= 0) {
    taxResultDiv.innerHTML = `<p><strong>Sell anything that is positive</strong></p>`;
    return;
  }

  // Calculate: YTD / (1 - tax_bracket_value)
  const breakevenPoint = ytdEarnings / (1 - taxBracketValue);
  const breakevenPercent = breakevenPoint.toFixed(2);

  // Calculate buffer points
  const greedy5Percent = (breakevenPoint * 1.05).toFixed(2);
  const mild10Percent = (breakevenPoint * 1.10).toFixed(2);
  const conservative15Percent = (breakevenPoint * 1.15).toFixed(2);

  // Calculate sell prices
  const greedy5Price = (stockPrice * (1 - (parseFloat(greedy5Percent) / 100))).toFixed(2);
  const mild10Price = (stockPrice * (1 - (parseFloat(mild10Percent) / 100))).toFixed(2);
  const conservative15Price = (stockPrice * (1 - (parseFloat(conservative15Percent) / 100))).toFixed(2);
  const breakevenPrice = (stockPrice * (1 - (parseFloat(breakevenPercent) / 100))).toFixed(2);

  taxResultDiv.innerHTML = `
    <p><strong>Breakeven Point:</strong> Sell anything above ${breakevenPercent}%</p>
    <p><strong>Greedy (5% buffer):</strong> Sell anything above ${greedy5Percent}%</p>
    <p><strong>Mild (10% buffer):</strong> Sell anything above ${mild10Percent}%</p>
    <p><strong>Conservative (15% buffer):</strong> Sell anything above ${conservative15Percent}%</p>
    <hr style="margin: 15px 0;" />
    <h3>Sell Prices</h3>
    <p><strong>Breakeven Price:</strong> $${breakevenPrice}</p>
    <p><strong>Greedy Price:</strong> $${greedy5Price}</p>
    <p><strong>Mild Price:</strong> $${mild10Price}</p>
    <p><strong>Conservative Price:</strong> $${conservative15Price}</p>
  `;
});
