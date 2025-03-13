import { User } from "../../../auth/interfaces/models/user.model";

export interface Person {
    personId: number;
    firstName: string;
    secondName: string;
    firstLastName: string;
    secondLastName: string;
    identificationTypeCatId: number;
    identificationNumber: string;
    phone: string;
    email: string;
    address: string;
    configurationId: number;
    user: Partial<User>;
}