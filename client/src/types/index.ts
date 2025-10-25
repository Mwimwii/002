// Shared types between client and server
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface FileUploadRequest {
  price: number;
  tokenType: string;
  fileSize: number;
}

export interface FileUploadResponse {
  success: boolean;
  cid?: string;
  filename?: string;
  size?: number;
  gatewayUrl?: string;
  price?: number;
  tokenType?: string;
  paymentRequired?: boolean;
  paymentEndpoint?: string;
}

export interface PaymentVerificationRequest {
  cid: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  hasPaid: boolean;
  paymentRecordId?: string;
  paymentTimestamp?: string;
}

// Data model entities
export interface User {
  walletAddress: string;
  profileInfo?: {
    displayName?: string;
    avatarURL?: string;
  };
  paymentHistory?: PaymentRecord[];
}

export interface Group {
  id: string;
  name: string;
  creator: string; // wallet address of the creator (admin)
  members: string[]; // array of wallet addresses
  createdAt: Date;
  permissions?: {
    [key: string]: string; // role-based permissions
  };
}

export interface Message {
  id: string;
  sender: string; // wallet address
  groupId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file';
  fileAttachment?: FileAttachment;
}

export interface FileAttachment {
  cid: string;
  filename: string;
  size: number;
  mimeType?: string;
  uploadTimestamp: Date;
  uploader: string; // wallet address
  price: number;
  tokenType: string;
  pinataGatewayURL: string;
}

export interface PaymentRecord {
  id: string;
  payer: string; // wallet address
  fileId: string; // CID of the file
  amount: number;
  tokenType: string;
  transactionHash: string;
  paymentTimestamp: Date;
  paymentStatus: 'pending' | 'confirmed' | 'failed';
}