export interface UserListPaginated {
    userId: number;
    name: string;
    email: string;
    telefono: string;
}

export interface User {
    userId: number;
    name: string;
    email: string;
    telefono: string;
    role: string[];
}