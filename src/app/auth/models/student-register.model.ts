export interface StudentRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  birth_date: string; // ISO format
  institutionId: number;
  guardianProfileId: number;
}
