"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WalletState, WalletBalance } from "@/lib/stellar";

interface WalletConnectProps {
  walletState: WalletState;
  balance: WalletBalance;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function WalletConnect({
  walletState,
  balance,
  isConnecting,
  onConnect,
  onDisconnect,
}: WalletConnectProps) {
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (walletState.isConnected && walletState.address) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium">Connected</span>
            <Badge variant="secondary">{walletState.network}</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={onDisconnect}>
            Disconnect
          </Button>
        </div>
        
        <div className="rounded-lg bg-muted p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Address</span>
            <code className="text-xs bg-background px-2 py-1 rounded">
              {formatAddress(walletState.address)}
            </code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Balance</span>
            <span className="font-mono font-medium">
              {balance.isLoading ? (
                <span className="text-muted-foreground">Loading...</span>
              ) : (
                <>
                  {parseFloat(balance.xlmBalance).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  XLM
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center space-y-2">
        <div className="h-12 w-12 mx-auto rounded-full bg-muted flex items-center justify-center">
          <svg
            className="h-6 w-6 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold">Connect Your Wallet</h3>
        <p className="text-sm text-muted-foreground">
          Connect your Freighter wallet to request testnet XLM
        </p>
      </div>

      {walletState.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {walletState.error}
        </div>
      )}

      <Button onClick={onConnect} disabled={isConnecting} className="w-full">
        {isConnecting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Connecting...
          </>
        ) : (
          <>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            Connect Freighter
          </>
        )}
      </Button>
    </div>
  );
}
