import { MiddlewareHandler } from 'hono';
import type { Context } from 'hono';

interface AuthMiddlewareConfig {
  allowlistedPaths?: string[];
}

export const authMiddleware = (config?: AuthMiddlewareConfig): MiddlewareHandler => {
  return async (c: Context, next) => {
    // Skip authentication for allowlisted paths (like health checks)
    if (config?.allowlistedPaths?.includes(c.req.path)) {
      return next();
    }

    // Extract wallet address and signature from headers
    const walletAddress = c.req.header('X-Wallet-Address');
    const signature = c.req.header('X-Signature');

    // Validate that both headers are present
    if (!walletAddress || !signature) {
      return c.json({ 
        success: false, 
        error: 'Wallet address and signature are required for authentication' 
      }, 401);
    }

    // Validate wallet address format (basic validation)
    if (!isValidWalletAddress(walletAddress)) {
      return c.json({ 
        success: false, 
        error: 'Invalid wallet address format' 
      }, 400);
    }

    // In a real implementation, you would verify the signature against the wallet address
    // For now, we'll just check that they were provided
    // const isValid = await verifyWalletSignature(walletAddress, signature, c.req);
    
    // For this implementation, we'll assume the authentication is valid
    // and attach the wallet address to the context
    c.set('walletAddress', walletAddress);

    await next();
  };
};

// Helper function to validate wallet address format
const isValidWalletAddress = (address: string): boolean => {
  // Basic validation for Ethereum wallet address
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export { authMiddleware };