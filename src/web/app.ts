// Inline calculator logic to avoid module loading issues with file:// protocol
function calculate(input: {
  type: string;
  cashBalance: number;
  assetPrice: number;
  underlyingAssetPrice: number;
  underlyingAsset200MaPrice: number;
}) {
  const portfolioScaleFactor = Math.max(
    1,
    Math.floor(input.cashBalance / 1_500)
  );

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

const form = document.getElementById("calculatorForm") as HTMLFormElement;
const resultDiv = document.getElementById("result") as HTMLDivElement;

console.log("Script loaded successfully");

form.addEventListener("submit", (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
  console.log("Form submitted, event prevented");

  const formData = new FormData(form);
  const investmentType = formData.get("investmentType") as string;
  const assetPrice = parseFloat(formData.get("assetPrice") as string);
  const cashBalance = parseFloat(formData.get("cashBalance") as string);
  const underlyingAssetPrice = parseFloat(
    formData.get("underlyingAssetPrice") as string
  );
  const underlyingAsset200MaPrice = parseFloat(
    formData.get("underlyingAsset200MaPrice") as string
  );

  // Validate inputs
  if (
    isNaN(assetPrice) ||
    isNaN(cashBalance) ||
    isNaN(underlyingAssetPrice) ||
    isNaN(underlyingAsset200MaPrice)
  ) {
    resultDiv.innerHTML = "<p>Error: Please enter valid numbers</p>";
    return false;
  }

  if (
    assetPrice <= 0 ||
    cashBalance <= 0 ||
    underlyingAssetPrice <= 0 ||
    underlyingAsset200MaPrice <= 0
  ) {
    resultDiv.innerHTML = "<p>Error: All values must be greater than zero</p>";
    return false;
  }

  const input = {
    type: investmentType,
    assetPrice,
    cashBalance,
    underlyingAssetPrice,
    underlyingAsset200MaPrice,
  };

  console.log("Input:", input);

  const result = calculate(input);

  console.log("Result:", result);

  // Calculate additional details
  const portfolioScaleFactor = Math.max(1, Math.floor(cashBalance / 1_500));
  const distance =
    (underlyingAssetPrice - underlyingAsset200MaPrice) /
    underlyingAsset200MaPrice;
  const distancePercent = (distance * 100).toFixed(2);

  resultDiv.innerHTML = `
    <h2>Results</h2>
    <p><strong>Investment Type:</strong> ${result.type}</p>
    <p><strong>Recommended Investment Amount:</strong> $${result.finalInvestment.toFixed(
      2
    )}</p>
    <h3>Details</h3>
    <p><strong>Portfolio Scale Factor:</strong> ${portfolioScaleFactor}x</p>
    <p><strong>Distance from 200MA:</strong> ${distancePercent}%</p>
    <p><strong>Market Position:</strong> ${
      distance > 0
        ? "Above 200MA (reducing investment)"
        : "Below 200MA (increasing investment)"
    }</p>
  `;

  console.log("Results displayed successfully");

  return false;
});
