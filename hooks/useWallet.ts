"use client";

import { useState, useEffect, useCallback } from "react";
import {
  checkWalletConnection,
  getWalletAddress,
  getWalletNetwork,
  requestWalletAccess,
  fetchBalance,
  isCorrectNetwork,
  fundAccount,
  WalletState,
  WalletBalance,
  TransactionResult,
} from "@/lib/stellar";

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    network: "",
    networkPassphrase: "",
    networkUrl: "",
    error: null,
  });

  const [balance, setBalance] = useState<WalletBalance>({
    xlmBalance: "0",
    isLoading: false,
    error: null,
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionResult, setTransactionResult] = useState<TransactionResult | null>(null);

  // Check wallet connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const connection = await checkWalletConnection();
      
      if (connection.isConnected) {
        const addressResult = await getWalletAddress();
        const networkResult = await getWalletNetwork();

        setWalletState({
          isConnected: connection.isConnected,
          address: addressResult.address,
          network: networkResult.network,
          networkPassphrase: networkResult.networkPassphrase,
          networkUrl: networkResult.networkUrl,
          error: addressResult.error || networkResult.error || null,
        });

        // Fetch balance if connected
        if (addressResult.address) {
          fetchWalletBalance(addressResult.address);
        }
      } else {
        setWalletState((prev) => ({
          ...prev,
          isConnected: false,
          error: connection.error || "Wallet not connected",
        }));
      }
    };

    checkConnection();
  }, []);

  // Fetch wallet balance
  const fetchWalletBalance = useCallback(async (address: string) => {
    setIsFetchingBalance(true);
    setBalance((prev) => ({ ...prev, isLoading: true }));

    const result = await fetchBalance(address);

    setBalance(result);
    setIsFetchingBalance(false);
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    setWalletState((prev) => ({ ...prev, error: null }));

    const result = await requestWalletAccess();

    if (result.address) {
      const networkResult = await getWalletNetwork();
      
      setWalletState({
        isConnected: true,
        address: result.address,
        network: networkResult.network,
        networkPassphrase: networkResult.networkPassphrase,
        networkUrl: networkResult.networkUrl,
        error: networkResult.error || null,
      });

      // Fetch balance after connecting
      await fetchWalletBalance(result.address);
    } else {
      setWalletState((prev) => ({
        ...prev,
        error: result.error || "Failed to connect wallet",
      }));
    }

    setIsConnecting(false);
  }, [fetchWalletBalance]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: null,
      network: "",
      networkPassphrase: "",
      networkUrl: "",
      error: null,
    });
    setBalance({
      xlmBalance: "0",
      isLoading: false,
      error: null,
    });
    setTransactionResult(null);
  }, []);

  // Request funds from faucet using friendbot
  const requestFunds = useCallback(async (): Promise<TransactionResult> => {
    if (!walletState.address) {
      return { success: false, error: "Wallet not connected" };
    }

    // Check if on correct network
    const networkCheck = await isCorrectNetwork();
    if (!networkCheck.isCorrect) {
      return {
        success: false,
        error: `Please switch to TESTNET network in Freighter. Current: ${networkCheck.currentNetwork}`,
      };
    }

    setIsSubmitting(true);
    setTransactionResult(null);

    try {
      // Use friendbot to fund the account
      const result = await fundAccount(walletState.address);

      setTransactionResult(result);

      // Refresh balance after successful transaction
      if (result.success) {
        await fetchWalletBalance(walletState.address);
      }

      setIsSubmitting(false);
      return result;
    } catch (error) {
      const result = { success: false, error: String(error) };
      setTransactionResult(result);
      setIsSubmitting(false);
      return result;
    }
  }, [walletState, fetchWalletBalance]);

  // Clear transaction result
  const clearTransactionResult = useCallback(() => {
    setTransactionResult(null);
  }, []);

  return {
    walletState,
    balance,
    isConnecting,
    isFetchingBalance,
    isSubmitting,
    transactionResult,
    connectWallet,
    disconnectWallet,
    requestFunds,
    clearTransactionResult,
    refreshBalance: () => walletState.address && fetchWalletBalance(walletState.address),
  };
}
