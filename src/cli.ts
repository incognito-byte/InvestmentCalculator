#!/usr/bin/env node

import prompts from "prompts";
import { calculate, formatResult, type CalculationType } from "./calculator";

async function main() {
  console.log("\n💰 Investment Calculator\n");
  console.log(
    "Calculate returns on your investments using simple or compound interest.\n"
  );

  try {
    const typeResponse = await prompts({
      type: "select",
      name: "investmentType",
      message: "Select investment type:",
      choices: [
        { title: "TQQQ Investment", value: "tqqq-investment" },
        { title: "UPRO Investment", value: "upro-investment" },
        { title: "Both (TQQQ and UPRO)", value: "both" },
      ],
      initial: 0,
    });

    if (!typeResponse.investmentType) {
      console.log("\nCalculation cancelled.");
      process.exit(0);
    }

    let tqqqAmount = 0;
    let uproAmount = 0;

    if (
      typeResponse.investmentType === "tqqq-investment" ||
      typeResponse.investmentType === "both"
    ) {
      const tqqqAmountResponse = await prompts({
        type: "select",
        name: "tqqqAmount",
        message: "Select TQQQ amount:",
        choices: [
          { title: "130 (above 100 and 200 MA)", value: 130 },
          { title: "1000 (below 100 and 200 MA)", value: 1000 },
        ],
        initial: 0,
      });

      if (tqqqAmountResponse.tqqqAmount === undefined) {
        console.log("\nCalculation cancelled.");
        process.exit(0);
      }
      tqqqAmount = tqqqAmountResponse.tqqqAmount;
    }

    if (
      typeResponse.investmentType === "upro-investment" ||
      typeResponse.investmentType === "both"
    ) {
      const uproAmountResponse = await prompts({
        type: "select",
        name: "uproAmount",
        message: "Select UPRO amount:",
        choices: [
          { title: "750 (below 100 and 200 MA)", value: 750 },
          { title: "70 (above 100 and 200 MA)", value: 70 },
        ],
        initial: 0,
      });

      if (uproAmountResponse.uproAmount === undefined) {
        console.log("\nCalculation cancelled.");
        process.exit(0);
      }
      uproAmount = uproAmountResponse.uproAmount;
    }

    const cashBalanceResponse = await prompts({
      type: "text",
      name: "cashBalance",
      message: "Enter the cash balance amount:",
      initial: "0",
      validate: (value) => {
        const num = parseFloat(value);
        if (isNaN(num)) return "Please enter a valid number";
        if (num <= 0) return "Cash balance must be greater than 0";
        return true;
      },
    });

    if (!cashBalanceResponse.cashBalance) {
      console.log("\nCalculation cancelled.");
      process.exit(0);
    }

    let qqqPrice = 0;
    let qqq200Ma = 0;
    let vooPrice = 0;
    let voo200Ma = 0;

    if (
      typeResponse.investmentType === "tqqq-investment" ||
      typeResponse.investmentType === "both"
    ) {
      const qqqPriceResponse = await prompts({
        type: "text",
        name: "qqqPrice",
        message: "Enter the QQQ price:",
        initial: "0",
        validate: (value) => {
          const num = parseFloat(value);
          if (isNaN(num)) return "Please enter a valid number";
          if (num <= 0) return "QQQ price must be greater than 0";
          return true;
        },
      });

      if (qqqPriceResponse.qqqPrice === undefined) {
        console.log("\nCalculation cancelled.");
        process.exit(0);
      }

      const qqq200MaPrice = await prompts({
        type: "text",
        name: "qqq200MaPrice",
        message: "Enter the QQQ 200MA price:",
        initial: "0",
        validate: (value) => {
          const num = parseFloat(value);
          if (isNaN(num)) return "Please enter a valid number";
          if (num <= 0) return "QQQ 200MA price must be greater than 0";
          return true;
        },
      });

      if (qqq200MaPrice.qqq200MaPrice === undefined) {
        console.log("\nCalculation cancelled.");
        process.exit(0);
      }
      qqqPrice = parseFloat(qqqPriceResponse.qqqPrice);
      qqq200Ma = parseFloat(qqq200MaPrice.qqq200MaPrice);
    }

    if (
      typeResponse.investmentType === "upro-investment" ||
      typeResponse.investmentType === "both"
    ) {
      const vooPriceResponse = await prompts({
        type: "text",
        name: "vooPrice",
        message: "Enter the VOO price:",
        initial: "0",
        validate: (value) => {
          const num = parseFloat(value);
          if (isNaN(num)) return "Please enter a valid number";
          if (num <= 0) return "VOO price must be greater than 0";
          return true;
        },
      });

      if (vooPriceResponse.vooPrice === undefined) {
        console.log("\nCalculation cancelled.");
        process.exit(0);
      }

      const voo200MaPrice = await prompts({
        type: "text",
        name: "voo200MaPrice",
        message: "Enter the VOO 200MA price:",
        initial: "0",
        validate: (value) => {
          const num = parseFloat(value);
          if (isNaN(num)) return "Please enter a valid number";
          if (num <= 0) return "VOO 200MA price must be greater than 0";
          return true;
        },
      });

      if (voo200MaPrice.voo200MaPrice === undefined) {
        console.log("\nCalculation cancelled.");
        process.exit(0);
      }
      vooPrice = parseFloat(vooPriceResponse.vooPrice);
      voo200Ma = parseFloat(voo200MaPrice.voo200MaPrice);
    }

    const cashBalance = parseFloat(cashBalanceResponse.cashBalance);

    // Perform calculations
    console.log("\n=== Results ===");
    console.log(`Cash Balance: $${cashBalance.toFixed(2)}`);
    console.log(
      `Portfolio Scale Factor: ${Math.max(
        1,
        Math.floor(cashBalance / 1_500)
      )}x\n`
    );

    if (
      typeResponse.investmentType === "tqqq-investment" ||
      typeResponse.investmentType === "both"
    ) {
      const tqqqResult = calculate({
        type: "tqqq-investment",
        cashBalance,
        assetPrice: tqqqAmount,
        underlyingAssetPrice: qqqPrice,
        underlyingAsset200MaPrice: qqq200Ma,
      });
      console.log(formatResult(tqqqResult));
      console.log(`TQQQ Amount Used: $${tqqqAmount}\n`);
    }

    if (
      typeResponse.investmentType === "upro-investment" ||
      typeResponse.investmentType === "both"
    ) {
      const uproResult = calculate({
        type: "upro-investment",
        cashBalance,
        assetPrice: uproAmount,
        underlyingAssetPrice: vooPrice,
        underlyingAsset200MaPrice: voo200Ma,
      });
      console.log(formatResult(uproResult));
      console.log(`UPRO Amount Used: $${uproAmount}\n`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("\nError:", error.message);
    }
    process.exit(1);
  }
}

// Handle Ctrl+C gracefully
process.on("SIGINT", () => {
  console.log("\n\nCalculation cancelled. Goodbye! 👋\n");
  process.exit(0);
});

main();
