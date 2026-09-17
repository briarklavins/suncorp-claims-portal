export interface PolicySummary {
  policyNumber: string;
  brandCode: string;
  brandName: string;
  productType: string;
  status: string;
  policyHolderName: string;
  expiryDate: Date;
  totalPremium: number;
}

export interface Coverage {
  coverageCode: string;
  sumInsured: number;
  excess: number;
  premium: number;
  optional: boolean;
}

export interface Policy {
  policyNumber: string;
  brandCode: string;
  productType: string;
  status: string;
  customerMasterId: string;
  riskState: string;
  riskPostcode: string;
  inceptionDate: Date;
  expiryDate: Date;
  basePremium: number;
  stampDuty: number;
  gst: number;
  totalPremium: number;
  paymentFrequency: string;
  coverages: Coverage[];
}
