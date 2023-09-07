import { User } from "../models/User";
import { Organization } from "../models/Organization";

const mockUsers: User[] = [
  {
    id: 34,
    organizationId: 21,
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@email.com",
    password: "john12345",
    phoneNum: "012-3456789",
    createBy: 1,
    createTimestamp: "2023-07-22T09:53:33Z"
  },
  {
    id: 41,
    organizationId: 21,
    firstName: "Mary",
    lastName: "Doe",
    email: "marydoe@email.com",
    password: "mary12345",
    phoneNum: "019-8765432",
    createBy: 34,
    createTimestamp: "2023-07-26T09:53:50Z"
  },
  {
    id: 47,
    organizationId: 21,
    firstName: "Tommy",
    lastName: "Doe",
    email: "tommydoe@email.com",
    password: "tommy12345",
    phoneNum: "011-2865432",
    createBy: 34,
    createTimestamp: "2023-07-26T11:53:50Z"
  }
];

const mockUserPermissions = [
  {
    userId: 34,
    permissions: [
      "User.View",
      "User.Create",
      "User.Modify",
      "User.Delete",
      "Organization.View",
      "Organization.Create",
      "Organization.Modify",
      "Organization.Delete"
    ]
  },
  {
    userId: 41,
    permissions: [
      "Organization.View",
      "Organization.Create",
      "Organization.Modify",
      "Organization.Delete"
    ]
  },
  {
    userId: 47,
    permissions: ["User.View", "Organization.View"]
  }
];

const mockOrganizations: Organization[] = [
  {
    id: 21,
    name: "Company ABC Sdn Bhd",
    businessRegNum: "X-182623",
    address: "No. 5, Jalan 12, Kuala Lumpur",
    postcode: "59000",
    contactNum: "03-2727356",
    createBy: 34,
    createTimestamp: "2023-08-12T02:32:10Z"
  },
  {
    id: 24,
    name: "Company XYZ Sdn Bhd",
    businessRegNum: "X-182623",
    address: "No. 3, Jalan 27, Selangor",
    postcode: "41200",
    contactNum: "03-2727356",
    createBy: 41,
    createTimestamp: "2023-08-14T01:22:10Z"
  },
  {
    id: 29,
    name: "Company JKL Sdn Bhd",
    businessRegNum: "X-182623",
    address: "No. 17, Jalan 8, Kuala Lumpur",
    postcode: "57200",
    contactNum: "03-2727356",
    createBy: 41,
    createTimestamp: "2023-08-18T12:32:10Z"
  }
];

const api = {
  auth: {
    login: async (
      email: string,
      password: string
    ): Promise<User | null | undefined> => {
      return (
        mockUsers.find((u) => u.email === email && u.password === password) ??
        null
      );
    }
  },
  user: {
    getAll: async (): Promise<User[]> => {
      return mockUsers;
    },
    getById: async (userId: number): Promise<User | null | undefined> => {
      return mockUsers.find((u) => u.id === userId);
    }
  },
  organization: {
    getAll: async (): Promise<Organization[]> => {
      return mockOrganizations;
    },
    getById: async (
      organizationId: number
    ): Promise<Organization | null | undefined> => {
      return mockOrganizations.find((o) => o.id === organizationId);
    },
    update: async (organization: Organization): Promise<Organization> => {
      return organization;
    },
    create: async (organization: Organization): Promise<Organization> => {
      return organization;
    }
  }
};

export default api;
