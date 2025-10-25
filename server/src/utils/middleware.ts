import type { Context, Next } from "hono";
import type { FacilitatorConfig, PaymentConfig, NetworkType } from "./types";
import { paymentMiddleware } from "x402-hono";
import { createFacilitatorConfig } from "@coinbase/x402";

const PRICE_PER_GB = 0.1;
const MONTHS = 12;

export const createDynamicPaymentMiddleware = (
  receivingWallet: `0x`,
  initialBaseConfig: PaymentConfig,
  initialFacilitatorConfig: FacilitatorConfig | null,
  network: NetworkType = "base"
) => {
  return async (c: Context, next: Next) => {
    let baseConfig = { ...initialBaseConfig };
    let facilitatorConfig = initialFacilitatorConfig;

    if (!facilitatorConfig) {
      // Validate required environment variables
      if (!c.env.CDP_API_KEY_ID || !c.env.CDP_API_KEY_SECRET) {
        throw new Error('CDP_API_KEY_ID and CDP_API_KEY_SECRET environment variables are required');
      }
      
      //  Custom config for mainnet to ensure we can get envs from context
      facilitatorConfig = createFacilitatorConfig(c.env.CDP_API_KEY_ID, c.env.CDP_API_KEY_SECRET)
      console.log({ facilitatorConfig })
    }
    if (c.req.method === "POST") {
      const reqData = await c.req.json();
      const { fileSize } = reqData;

      const fileSizeInGB = fileSize / (1024 * 1024 * 1024);
      const price = fileSizeInGB * PRICE_PER_GB * MONTHS;
      const priceToUse = price >= 0.0001 ? price : 0.0001;
      baseConfig = {
        "/api/v1/upload": {
          price: `${priceToUse.toFixed(4)}`,
          network: network,
          config: {
            discoverable: true,
            description: "Pay to upload a file to Pinata",
            inputSchema: {
              bodyParams: {
                file: {
                  type: "string",
                  description: "File to upload (multipart form data)",
                  required: true
                },
                price: {
                  type: "number",
                  description: "Required payment amount for file access",
                  required: true
                },
                tokenType: {
                  type: "string",
                  description: "Token type for payment (e.g., ETH)",
                  required: true
                }
              }
            },
            outputSchema: {
              type: "object",
              properties: {
                success: {
                  type: "boolean",
                  description: "Whether the operation was successful"
                },
                cid: {
                  type: "string",
                  description: "Content Identifier (CID) of the uploaded file"
                },
                gatewayUrl: {
                  type: "string",
                  description: "Gateway URL for accessing the file"
                }
              }
            }
          },
        },
      };
    } else {
      baseConfig = {
        "/api/v1/download/*": {
          price: "$0.0001",
          network: network,
          config: {
            discoverable: true,
            description: "Pay to retrieve a file from Pinata by CID",
            inputSchema: {
              pathParams: {
                cid: {
                  type: "string",
                  description: "Content Identifier (CID) of the file to retrieve",
                  required: true
                }
              }
            },
            outputSchema: {
              type: "object",
              properties: {
                url: {
                  type: "string",
                  description: "Temporary access URL for the file"
                }
              }
            }
          },
        },
      }
    }

    const dynamicPaymentMiddleware = paymentMiddleware(
      receivingWallet,
      baseConfig as any,
      facilitatorConfig
    );

    return dynamicPaymentMiddleware(c, next);
  };
};

// Function to calculate price based on file size
export const calculatePriceForFileSize = (fileSizeInBytes: number): number => {
  const fileSizeInGB = fileSizeInBytes / (1024 * 1024 * 1024); // Convert bytes to GB
  const basePrice = fileSizeInGB * PRICE_PER_GB * MONTHS; // Base price for storage
  const minimumPrice = 0.0001; // Minimum price threshold
  return Math.max(basePrice, minimumPrice);
};

export { createDynamicPaymentMiddleware };