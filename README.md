# XLM Faucet - Stellar Testnet

A simple and user-friendly web application that allows users to receive XLM (Stellar Lumens) on the Stellar testnet. Built with Next.js, TypeScript, and Tailwind CSS, this faucet integrates with the Freighter wallet to provide a seamless experience for requesting testnet funds.

## Features

- **Wallet Connection**: Connect your Freighter wallet to the Stellar testnet
- **Balance Display**: View your current XLM balance in real-time
- **Testnet Faucet**: Request XLM from the faucet for testing purposes
- **Transaction Tracking**: View transaction results and confirmations
- **Responsive UI**: Clean, modern interface built with Tailwind CSS and shadcn/ui components

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Freighter browser extension (for wallet functionality)

### Local Development

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd d:/Steller/xlm-faucet-stellar
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

5. **Install Freighter wallet** (if not already installed):
   - Visit [Freighter's official website](https://www.freighter.app/)
   - Add the browser extension
   - Create or import a wallet
   - Switch to **Testnet** mode in Freighter settings

6. **Connect your wallet** and start requesting XLM from the faucet!

## Screenshots

### Wallet Connected State
![Wallet Connected](screenshots/wallet-connected.png)
*The wallet is connected and ready to interact with the faucet.*

### Balance Displayed
![Balance Displayed](screenshots/balance-displayed.png)
*User's XLM balance is shown after wallet connection.*

### Successful Testnet Airdrop
![Transaction Success](screenshots/transaction-success.png)
*A successful transaction from the faucet to the user's wallet.*



## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Blockchain**: Stellar SDK (stellar-sdk)
- **Wallet Integration**: Freighter wallet provider

## Project Structure

```
xlm-faucet-stellar/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── FaucetForm.tsx
│   ├── WalletConnect.tsx
│   └── ui/
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── hooks/
│   └── useWallet.ts
├── lib/
│   └── stellar.ts
├── public/
└── README.md
```

## Notes

- This application operates on the **Stellar Testnet** only. Do not send real funds.
- The faucet may have rate limits to prevent abuse.
- Ensure Freighter is set to **Testnet** mode before connecting.
- Transactions require a small amount of XLM for the base fee (already covered by the faucet).

## License

MIT
