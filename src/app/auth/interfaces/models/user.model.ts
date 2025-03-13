export interface User {
    userId: number;
    uid: string;
    username: string;
    email: string;
    password: string;
    userRoles: Partial<UserRole>[];
}

export interface UserRole {
    userRoleId: number;
    role: Partial<Role>;
    user: Partial<User>;
}

interface Role {
    roleId: number;
    name: string;
    description: string;
    userRoles: Partial<UserRole>[];
}

interface Privilege {
    privilegeId: number;
    name: string;
}
