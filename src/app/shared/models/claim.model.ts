export type ClaimStatus =
  'DRAFT' |
  'LODGED' |
  'UNDER_ASSESSMENT' |
  'ASSESSOR_BOOKED' |
  'REPAIR_IN_PROGRESS' |
  'SETTLED' |
  'DECLINED' |
  'WITHDRAWN';

export type ClaimType =
  'MOTOR_COLLISION' |
  'MOTOR_THEFT' |
  'MOTOR_HAIL' |
  'MOTOR_WINDSCREEN' |
  'HOME_STORM' |
  'HOME_FLOOD' |
  'HOME_BURGLARY' |
  'HOME_FUSION' |
  'HOME_ACCIDENTAL_DAMAGE';

export interface IncidentDetails {
  claimType: ClaimType;
  incidentDate: Date;
  incidentTime: string;
  description: string;
  incidentSuburb: string;
  incidentState: string;
  incidentPostcode: string;
  policeReported: boolean;
  policeEventNumber?: string;
  thirdPartyInvolved: boolean;
  driveable?: boolean;
}

export interface ThirdParty {
  name: string;
  contactNumber: string;
  registration?: string;
  insurer?: string;
  claimNumber?: string;
}

export interface SettlementDetails {
  method: 'REPAIR' | 'CASH_SETTLEMENT' | 'REPLACEMENT';
  accountName?: string;
  bsb?: string;
  accountNumber?: string;
  preferredRepairerId?: string;
}

export interface ClaimDocument {
  documentId: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  category: 'PHOTO' | 'QUOTE' | 'POLICE_REPORT' | 'RECEIPT' | 'OTHER';
  uploadedAt: Date;
}

export interface Claim {
  claimNumber?: string;
  policyNumber: string;
  brandCode: string;
  status: ClaimStatus;
  lodgedAt?: Date;
  excess?: number;
  estimatedSettlement?: number;
  incident: IncidentDetails;
  thirdParties: ThirdParty[];
  settlement: SettlementDetails;
  documents: ClaimDocument[];
  assessorName?: string;
  assessorBookingDate?: Date;
  lastUpdated?: Date;
}
