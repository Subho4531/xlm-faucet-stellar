"use client";

import { useWallet } from "@/hooks/useWallet";
import { WalletConnect } from "@/components/WalletConnect";
import { FaucetForm } from "@/components/FaucetForm";
import { Card } from "@/components/ui/card";

export default function Home() {
  const {
    walletState,
    balance,
    isConnecting,
    isSubmitting,
    transactionResult,
    connectWallet,
    disconnectWallet,
    requestFunds,
    clearTransactionResult,
  } = useWallet();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-primary"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Stellar Testnet Faucet
            </h1>
            <p className="text-muted-foreground">
              Request testnet XLM with one click
            </p>
          </div>

          {/* Wallet Connection */}
          <Card className="p-6">
            <WalletConnect
              walletState={walletState}
              balance={balance}
              isConnecting={isConnecting}
              onConnect={connectWallet}
              onDisconnect={disconnectWallet}
            />
          </Card>

          {/* Faucet Form - Only show when connected */}
          {walletState.isConnected && walletState.address && (
            <FaucetForm
              isSubmitting={isSubmitting}
              transactionResult={transactionResult}
              onRequestFunds={requestFunds}
              onClearResult={clearTransactionResult}
            />
          )}

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Powered by Stellar Network</p>
            <p className="mt-1">Testnet only - no real value</p>
          </div>
        </div>
      </div>
    </main>
  );
}
