# Crypto & Stock Tracker

Financial dashboard for tracking cryptocurrencies and US stocks. Application fetches and normalizes market data from CoinGecko and Yahoo Finance APIs. It features interactive financial charts (Candlestick and Line with volume) using lightweight-charts, an asset-specific news feed, and internationalization support (English/Polish).

## Features
- **Asset Tracking:** Data for cryptocurrencies and US stocks.
- **Advanced Charting:** Professional interactive charts using TradingView's lightweight-charts.
- **News Feed:** Latest financial news related to the selected asset.
- **Bilingual:** Full support for English and Polish languages.

## Tech Stack
- **Framework:** Next.js 16 (App Router, Server Actions)
- **Library:** React 19
- **Styling:** Tailwind CSS v4
- **Charts:** lightweight-charts
- **Internationalization:** next-intl
- **APIs:** CoinGecko API (Crypto), Yahoo Finance API via `yahoo-finance2` (Stocks & News)

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/naMqe-h/crypto-stock-tracker.git
   cd crypto-stock-tracker
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Application
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
