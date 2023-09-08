export interface Organization {
  id: number;
  name: string;
  businessRegNum: string;
  address: string;
  postcode: string;
  contactNum: string;
  createBy: number;
  createTimestamp: string;
}

export type OrganizationWithCreatorName = Organization & {
  creatorName: string;
};
