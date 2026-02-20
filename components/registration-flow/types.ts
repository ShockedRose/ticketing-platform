export type TicketTierUI = {
  id: string;
  name: string;
  slug: string;
  description: string;
  tagline: string | null;
  discount: string | null;
  couponCode: string | null;
  price: string; // Decimal as string
  currency: string;
  status: "AVAILABLE" | "SOLD_OUT" | "COMING_SOON";
  totalQuantity: number;
  soldQuantity: number;
  sortOrder: number;
  features: string[];
};

export type SelectedTickets = Record<string, number>; // slug -> quantity

export interface BuyerData {
  fullName: string;
  email: string;
  phone: string;
}

export interface AttendeeData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  jobTitle: string;
  companyName: string;
  companyUrl: string;
  workAddress: string;
  workPhone: string;
  emergencyContact: string;
  githubHandle: string;
  industry: string;
  organizationRepresents: string;
  organizationType: string;
  primaryRole: string;
  firstTimeKcd: string;
  shirtSize: string;
  dietaryNeeds: string;
  disabilityAccommodation: string;
  personOfColor: string;
  genderIdentity: string;
  ageRange: string;
  cncfConsent: boolean;
  sponsorCommunicationsOptIn: boolean;
}

export interface DiscountInfo {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: string;
  description: string | null;
}
