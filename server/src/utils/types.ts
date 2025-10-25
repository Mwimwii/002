export type NetworkType = "base" | "base-sepolia";

export interface Bindings {
  PINATA_JWT: string;
  PINATA_GATEWAY_URL: string;
  PINATA_GATEWAY_KEY: string;
  CDP_API_KEY_ID: string;
  CDP_API_KEY_SECRET: string;
  NETWORK: NetworkType;
  // Add other environment variables as needed
}

export interface FacilitatorConfig {
  // Define the structure based on x402 facilitator requirements
  endpoint: string;
  apiKey: string;
  // Add other facilitator properties as needed
}

export interface PaymentConfig {
  [key: string]: {
    price: string;
    network: NetworkType;
    config: {
      discoverable: boolean;
      description: string;
      inputSchema?: any;
      outputSchema?: any;
    };
  };
}

export interface PaymentPayload {
  // Define the structure for payment payload based on x402 protocol
  payload: {
    authorization: {
      from: string; // Wallet address
      // Add other auth properties as needed
    };
    // Add other payment payload properties as needed
  };
  // Add other payment payload properties as needed
}