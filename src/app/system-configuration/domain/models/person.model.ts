export interface PersonRequest {
    firstName: string;
    secondName: string;
    firstLastName: string;
    secondLastName: string;
    identificationTypeCatId: number;
    identificationNumber: string;
    phone: string;
    email: string;
    configurationId: number;
    user: UserRequest;

}

export interface UserRequest {
    uid: string;
    email: string;
    password: string;
    userRoles: UserRoles[];
}

interface UserRoles {
    role: RolRequest
}

interface RolRequest {
    name: string;
}