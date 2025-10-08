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
      ],
      initial: 0,
    });

    if (!typeResponse.investmentType) {
      console.log("\nCalculation cancelled.");
      process.exit(0);
    }

    let assetPrice = 0;
    if (typeResponse.investmentType === "tqqq-investment") {
      const tqqqPriceResponse = await prompts({
        type: "text",
        name: "tqqqPrice",
        message: "Enter the TQQQ price:",
        initial: "0",
        validate: (value) => {
          const num = parseFloat(value);
          if (isNaN(num)) return "Please enter a valid number";
          if (num <= 0) return "TQQQ price must be greater than 0";
          return true;
        },
      });

      if (!tqqqPriceResponse.tqqqPrice) {
        console.log("\nCalculation cancelled.");
        process.exit(0);
      }
      assetPrice = parseFloat(tqqqPriceResponse.tqqqPrice);
    } else {
      const uproPriceResponse = await prompts({
        type: "text",
        name: "uproPrice",
        message: "Enter the UPRO price:",
        initial: "0",
        validate: (value) => {
          const num = parseFloat(value);
          if (isNaN(num)) return "Please enter a valid number";
          if (num <= 0) return "UPRO price must be greater than 0";
          return true;
        },
      });

      if (!uproPriceResponse.uproPrice) {
        console.log("\nCalculation cancelled.");
        process.exit(0);
      }
      assetPrice = parseFloat(uproPriceResponse.uproPrice);
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

    let underlyingAssetPrice = 0;
    let underlyingAsset200MaPrice = 0;
    if (typeResponse.investmentType === "tqqq-investment") {
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
      underlyingAssetPrice = parseFloat(qqqPriceResponse.qqqPrice);
      underlyingAsset200MaPrice = parseFloat(qqq200MaPrice.qqq200MaPrice);
    } else {
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
      underlyingAssetPrice = parseFloat(vooPriceResponse.vooPrice);
      underlyingAsset200MaPrice = parseFloat(voo200MaPrice.voo200MaPrice);
    }

    // Perform calculation
    const result = calculate({
      type: typeResponse.investmentType,
      cashBalance: parseFloat(cashBalanceResponse.cashBalance),
      assetPrice,
      underlyingAssetPrice,
      underlyingAsset200MaPrice,
    });

    // Display result
    console.log(formatResult(result));
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
