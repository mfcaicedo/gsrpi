import { UserRole } from "../../../interfaces/models/user.model";

export interface UserDataSession {
    userId: number;
    personId: number;
    teacherId: number;
    nombres: string;
    apellidos: string;
    email: string;
    userRoles: Partial<UserRole>[];
    configurationId: number;
}