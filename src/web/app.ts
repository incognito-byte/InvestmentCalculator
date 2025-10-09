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
  const tqqqPrice = parseFloat(formData.get("tqqqPrice") as string);
  const qqqPrice = parseFloat(formData.get("qqqPrice") as string);
  const qqq200Ma = parseFloat(formData.get("qqq200Ma") as string);

  // UPRO inputs
  const uproPrice = parseFloat(formData.get("uproPrice") as string);
  const vooPrice = parseFloat(formData.get("vooPrice") as string);
  const voo200Ma = parseFloat(formData.get("voo200Ma") as string);

  // Validate inputs
  const allInputs = [
    cashBalance,
    tqqqPrice,
    qqqPrice,
    qqq200Ma,
    uproPrice,
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
    assetPrice: tqqqPrice,
    cashBalance,
    underlyingAssetPrice: qqqPrice,
    underlyingAsset200MaPrice: qqq200Ma,
  };

  // Calculate UPRO
  const uproInput = {
    type: "upro-investment",
    assetPrice: uproPrice,
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
