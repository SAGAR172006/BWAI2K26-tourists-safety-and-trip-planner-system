export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  phone?: string;
  dob?: string;
  gender?: "male" | "female" | "non-binary" | "prefer_not_to_say";
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  sortOrder: number;
}
