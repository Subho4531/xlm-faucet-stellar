import {
  isConnected,
  getAddress,
  getNetwork,
  getNetworkDetails,
  signTransaction,
  setAllowed,
} from "@stellar/freighter-api";

// Using the friendbot endpoint to fund testnet accounts
const FRIENDBOT_URL = "https://friendbot.stellar.org";

export const TESTNET_SERVER_URL = "https://horizon-testnet.stellar.org";
export const TESTNET_NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  network: string;
  networkPassphrase: string;
  networkUrl: string;
  error: string | null;
}

export interface WalletBalance {
  xlmBalance: string;
  isLoading: boolean;
  error: string | null;
}

export interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

// Check if Freighter wallet is connected
export async function checkWalletConnection(): Promise<{
  isConnected: boolean;
  error?: string;
}> {
  try {
    const result = await isConnected();
    return { isConnected: result.isConnected, error: result.error };
  } catch (error) {
    return { isConnected: false, error: String(error) };
  }
}

// Get the wallet address
export async function getWalletAddress(): Promise<{
  address: string | null;
  error?: string;
}> {
  try {
    const result = await getAddress();
    if (result.error) {
      return { address: null, error: result.error };
    }
    return { address: result.address };
  } catch (error) {
    return { address: null, error: String(error) };
  }
}

// Get the network configuration
export async function getWalletNetwork(): Promise<{
  network: string;
  networkPassphrase: string;
  networkUrl: string;
  error?: string;
}> {
  try {
    const result = await getNetworkDetails();
    if (result.error) {
      return {
        network: "",
        networkPassphrase: "",
        networkUrl: "",
        error: result.error,
      };
    }
    return {
      network: result.network,
      networkPassphrase: result.networkPassphrase,
      networkUrl: result.networkUrl,
    };
  } catch (error) {
    return {
      network: "",
      networkPassphrase: "",
      networkUrl: "",
      error: String(error),
    };
  }
}

// Request access to the wallet
export async function requestWalletAccess(): Promise<{
  address: string | null;
  error?: string;
}> {
  try {
    // First check if we need to request access
    const isWalletConnected = await isConnected();
    if (!isWalletConnected.isConnected) {
      return { address: null, error: "Freighter wallet is not installed" };
    }

    // Request access
    const result = await setAllowed();
    if (result.error) {
      return { address: null, error: result.error };
    }

    // Get the address after access is granted
    const addressResult = await getAddress();
    if (addressResult.error) {
      return { address: null, error: addressResult.error };
    }

    return { address: addressResult.address };
  } catch (error) {
    return { address: null, error: String(error) };
  }
}

// Fetch the wallet's XLM balance using fetch API
export async function fetchBalance(
  publicKey: string,
  networkUrl: string = TESTNET_SERVER_URL
): Promise<WalletBalance> {
  try {
    const response = await fetch(`${networkUrl}/accounts/${publicKey}`);
    
    if (!response.ok) {
      // Account doesn't exist yet (new accounts have 0 balance)
      if (response.status === 404) {
        return {
          xlmBalance: "0",
          isLoading: false,
          error: null,
        };
      }
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    const xlmBalance = data.balances?.find(
      (balance: { asset_type: string }) => balance.asset_type === "native"
    );

    return {
      xlmBalance: xlmBalance ? xlmBalance.balance : "0",
      isLoading: false,
      error: null,
    };
  } catch (error) {
    return {
      xlmBalance: "0",
      isLoading: false,
      error: String(error),
    };
  }
}

// Parse error response from friendbot
function parseFriendbotError(errorText: string): string {
  try {
    const errorJson = JSON.parse(errorText);
    // Return just the detail message if available
    return errorJson.detail || errorJson.title || errorText;
  } catch {
    return errorText;
  }
}

// Fund account using friendbot
export async function fundAccount(
  publicKey: string
): Promise<TransactionResult> {
  try {
    const response = await fetch(`${FRIENDBOT_URL}?addr=${encodeURIComponent(publicKey)}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      const parsedError = parseFriendbotError(errorText);
      return {
        success: false,
        error: parsedError,
      };
    }
    
    const data = await response.json();
    
    return {
      success: true,
      txHash: data.hash || data.transaction_hash,
    };
  } catch (error) {
    return {
      success: false,
      error: String(error),
    };
  }
}

// Check if the wallet is on the correct network
export async function isCorrectNetwork(): Promise<{
  isCorrect: boolean;
  currentNetwork?: string;
  error?: string;
}> {
  try {
    const network = await getNetwork();
    if (network.error) {
      return { isCorrect: false, error: network.error };
    }
    
    return {
      isCorrect: network.network === "TESTNET",
      currentNetwork: network.network,
    };
  } catch (error) {
    return { isCorrect: false, error: String(error) };
  }
}
