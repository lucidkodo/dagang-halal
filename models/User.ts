export interface User {
  id: number;
  organizationId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNum?: string | null;
  createBy: number;
  createTimestamp: string;
}
