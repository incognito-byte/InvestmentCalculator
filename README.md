# 💰 Investment Calculator

A dynamic investment calculator built with TypeScript that calculates position sizing based on portfolio balance and market conditions (distance from 200-day moving average). Supports both CLI and GitHub Actions workflows.

## Features

- 🖥️ **CLI Interface**: Interactive command-line tool with prompts
- ⚙️ **GitHub Actions**: Run calculations via workflow with custom inputs
- 📊 **Two Investment Types**:
  - TQQQ Investment (3x leveraged NASDAQ-100)
  - UPRO Investment (3x leveraged S&P 500)
- 🎯 **Dynamic Position Sizing**: Adjusts investment amount based on:
  - Cash balance (portfolio scale factor)
  - Distance from 200-day moving average (market condition)
- 📈 **Risk Management**: Reduces position size when market is extended above 200MA, increases when below

## Quick Start

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd InvestmentCalculator

# Install dependencies
npm install

# Build the project
npm run build
```

### Using the CLI

```bash
# Run the CLI tool
npm start
```

The CLI will prompt you for:
1. **Investment type**: TQQQ or UPRO
2. **Asset price**: Current price of the leveraged ETF
3. **Cash balance**: Your available cash for investment
4. **Underlying asset price**: Current price of QQQ or VOO
5. **Underlying asset 200MA price**: 200-day moving average of QQQ or VOO

All inputs support decimal values (e.g., `50.25`, `512.34`).

## Project Structure

```
InvestmentCalculator/
├── src/
│   ├── calculator.ts      # Core calculation logic
│   ├── cli.ts            # CLI interface
│   └── index.ts          # Main exports
├── dist/                 # Compiled JavaScript
├── .github/
│   └── workflows/
│       └── calculate-investment.yml  # GitHub Actions workflow
├── package.json
└── tsconfig.json
```

## Calculation Formula

The calculator uses dynamic position sizing based on two factors:

### 1. Portfolio Scale Factor
```
portfolioScaleFactor = max(1, floor(cashBalance / 1500))
```
This scales your position size based on portfolio size. For every $1,500 in cash, you get 1x multiplier.

### 2. Distance Scale Factor
```
distance = (underlyingPrice - underlying200MA) / underlying200MA
sensitivity = 5

if distance > 0 (above 200MA):
  distanceScaleFactor = 1 / (1 + sensitivity × distance)
else (below 200MA):
  distanceScaleFactor = 1 + sensitivity × |distance|
```
This adjusts position size based on market conditions:
- **Above 200MA**: Reduces position size (market extended)
- **Below 200MA**: Increases position size (market oversold)

### 3. Final Investment Amount
```
finalInvestment = assetPrice × portfolioScaleFactor × distanceScaleFactor
```

## GitHub Actions

### Calculate Investment Workflow

Run calculations directly from GitHub Actions without local setup.

**To use:**
1. Go to the **Actions** tab in your repository
2. Select **"Calculate Investment"** workflow
3. Click **"Run workflow"**
4. Fill in the parameters:
   - **Investment Type**: Choose TQQQ or UPRO
   - **Asset Price**: Current ETF price (e.g., `50.25`)
   - **Cash Balance**: Available cash (e.g., `10000.00`)
   - **Underlying Asset Price**: QQQ/VOO price (e.g., `512.34`)
   - **Underlying Asset 200MA Price**: 200MA of QQQ/VOO (e.g., `485.67`)
5. Click **"Run workflow"**
6. View results in the job summary

The workflow will display:
- Input parameters
- Recommended investment amount
- Portfolio scale factor
- Distance from 200MA
- Market position analysis

## Example Usage

### CLI Example

```bash
$ npm start

💰 Investment Calculator

Calculate returns on your investments using simple or compound interest.

? Select investment type: › TQQQ Investment
? Enter the TQQQ price: › 52.75
? Enter the cash balance amount: › 15000.00
? Enter the QQQ price: › 512.34
? Enter the QQQ 200MA price: › 485.67

tqqq-investment investment amount: $1,052.50
```

### Calculation Breakdown:
- **Portfolio Scale Factor**: 10 (from $15,000 / $1,500)
- **Distance from 200MA**: +5.5% (above 200MA)
- **Distance Scale Factor**: 0.78 (reducing due to extended market)
- **Final Investment**: $52.75 × 10 × 0.78 = $411.45

### GitHub Actions Example

Input:
- Investment Type: `tqqq-investment`
- Asset Price: `50.25`
- Cash Balance: `10000.00`
- Underlying Asset Price: `500.00`
- Underlying Asset 200MA Price: `480.00`

Output:
- Portfolio Scale Factor: 6x
- Distance from 200MA: +4.17%
- Recommended Investment: $262.89

## Scripts

- `npm run build` - Build the CLI application
- `npm start` - Run the CLI tool
- `npm run dev` - Run the CLI in development mode with ts-node

## Dependencies

- **prompts**: For interactive CLI prompts
- **typescript**: TypeScript compiler
- **ts-node**: TypeScript execution for development
- **@types/node**: Node.js type definitions
- **@types/prompts**: Prompts type definitions

## Use Cases

### Conservative Investing
When the market is above the 200MA (bullish), the calculator automatically reduces position size to protect against potential pullbacks.

### Aggressive Accumulation
When the market is below the 200MA (bearish), the calculator increases position size to take advantage of lower prices.

### Portfolio Scaling
Larger portfolios automatically get larger position sizes, maintaining appropriate position sizing relative to account size.

## Risk Disclaimer

This calculator is for educational and informational purposes only. It does not constitute financial advice. Leveraged ETFs like TQQQ and UPRO are complex instruments with significant risk, including:
- Daily rebalancing effects
- Volatility decay
- Amplified losses
- Not suitable for long-term buy-and-hold

Always consult with a qualified financial advisor before making investment decisions.

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
