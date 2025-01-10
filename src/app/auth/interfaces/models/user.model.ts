export interface User {
    userId?: string;
    documentNumber: string;
    username: string,
    email: string;
    firstName: string;
    lastName?: string;
    enabled: string;
    roles: Rol[];
}

interface Rol {
    rolId: number;
    nombreRol: string;
    privileges: Privilege[];
}

interface Privilege {
    privilegeId: number;
    name: string;
}
