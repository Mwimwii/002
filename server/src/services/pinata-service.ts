import { PinataSDK } from 'pinata';

interface PinataUploadResponse {
  success: boolean;
  cid?: string;
  filename?: string;
  size?: number;
  gatewayUrl?: string;
  error?: string;
}

interface PinataServiceConfig {
  jwt?: string;
  gateway?: string;
}

class PinataService {
  private pinata: PinataSDK | null = null;
  private config: PinataServiceConfig;

  constructor(config?: PinataServiceConfig) {
    this.config = config || {};
    
    if (this.config.jwt) {
      this.pinata = new PinataSDK({
        pinataJwt: this.config.jwt,
        pinataGateway: this.config.gateway,
      });
    }
  }

  async initialize(jwt: string, gateway?: string) {
    this.config = { jwt, gateway };
    this.pinata = new PinataSDK({
      pinataJwt: jwt,
      pinataGateway: gateway,
    });
  }

  async uploadFile(file: File, metadata?: { name?: string; keyvalues?: Record<string, string> }): Promise<PinataUploadResponse> {
    if (!this.pinata) {
      throw new Error('Pinata service not initialized. Call initialize() first.');
    }

    try {
      // Upload the file to Pinata
      const response = await this.pinata.upload.file()
        .source(file)
        .name(metadata?.name || file.name)
        .keyvalues(metadata?.keyvalues || {});

      return {
        success: true,
        cid: response.cid,
        filename: metadata?.name || file.name,
        size: file.size,
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${response.cid}`
      };
    } catch (error) {
      console.error('Error uploading file to Pinata:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async uploadFileFromBuffer(buffer: Buffer, fileName: string, metadata?: { keyvalues?: Record<string, string> }): Promise<PinataUploadResponse> {
    if (!this.pinata) {
      throw new Error('Pinata service not initialized. Call initialize() first.');
    }

    try {
      // Create a Blob from the buffer
      const file = new File([buffer], fileName, { type: 'application/octet-stream' });
      
      const response = await this.pinata.upload.file()
        .source(file)
        .name(fileName)
        .keyvalues(metadata?.keyvalues || {});

      return {
        success: true,
        cid: response.cid,
        filename: fileName,
        size: buffer.length,
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${response.cid}`
      };
    } catch (error) {
      console.error('Error uploading buffer to Pinata:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async createSignedUploadUrl(expiresInSeconds: number = 3600, maxFileSize?: number): Promise<{ success: boolean; url?: string; error?: string }> {
    if (!this.pinata) {
      throw new Error('Pinata service not initialized. Call initialize() first.');
    }

    try {
      const url = await this.pinata.upload.private.createSignedURL({
        expires: expiresInSeconds,
        maxFileSize: maxFileSize
      });

      return {
        success: true,
        url: url.url
      };
    } catch (error) {
      console.error('Error creating signed upload URL:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getGatewayUrl(cid: string): Promise<string> {
    return `https://gateway.pinata.cloud/ipfs/${cid}`;
  }

  isInitialized(): boolean {
    return this.pinata !== null;
  }
}

export default new PinataService();
export { PinataService, type PinataUploadResponse };