"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionResult } from "@/lib/stellar";

interface FaucetFormProps {
  isSubmitting: boolean;
  transactionResult: TransactionResult | null;
  onRequestFunds: () => Promise<TransactionResult>;
  onClearResult: () => void;
}

export function FaucetForm({
  isSubmitting,
  transactionResult,
  onRequestFunds,
  onClearResult,
}: FaucetFormProps) {
  const [showTxHash, setShowTxHash] = useState(false);

  const handleRequest = async () => {
    setShowTxHash(false);
    await onRequestFunds();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Request Testnet XLM</CardTitle>
        <CardDescription>
          Get 10,000 XLM on Stellar Testnet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium">10,000 XLM</p>
                <p className="text-sm text-muted-foreground">One-time funding</p>
              </div>
            </div>
          </div>

          {transactionResult && (
            <div
              className={`rounded-lg p-4 ${
                transactionResult.success
                  ? "bg-green-500/10 border border-green-500/20"
                  : "bg-destructive/10 border border-destructive/20"
              }`}
            >
              <div className="flex items-start gap-3">
                {transactionResult.success ? (
                  <svg
                    className="h-5 w-5 text-green-500 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-destructive mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
                <div className="flex-1 space-y-2">
                  <p
                    className={`font-medium ${
                      transactionResult.success ? "text-green-500" : "text-destructive"
                    }`}
                  >
                    {transactionResult.success
                      ? "Transaction Successful!"
                      : "Transaction Failed"}
                  </p>
                  
                  {transactionResult.success && transactionResult.txHash && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Your wallet has been funded with 10,000 XLM
                      </p>
                      <button
                        onClick={() => setShowTxHash(!showTxHash)}
                        className="text-xs text-primary hover:underline"
                      >
                        {showTxHash ? "Hide" : "View"} Transaction Hash
                      </button>
                      {showTxHash && (
                        <code className="block text-xs bg-background p-2 rounded break-all">
                          {transactionResult.txHash}
                        </code>
                      )}
                    </div>
                  )}
                  
                  {transactionResult.error && (
                    <p className="text-sm text-destructive">{transactionResult.error}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-3">
        {transactionResult && (
          <Button variant="outline" onClick={onClearResult} className="flex-1">
            Clear
          </Button>
        )}
        <Button
          onClick={handleRequest}
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Processing...
            </>
          ) : (
            "Request Funds"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
