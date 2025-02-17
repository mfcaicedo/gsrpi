import { Teacher } from "./teacher-common.model";

export interface Application {
    applicationId: number;
    description: string;
    numberOfAuthors: number;
    termsAndConditions: boolean;
    applicationTypeCatId: number;
    applicationTypeName: string;
    createAt: string;
    department: Partial<Department>;
    production: Partial<Production>;
    applicationStatus: Partial<StatusApplication>;
    teacherApplications: Partial<TeacherApplication>[];
}

export interface Department {
    odepartmentId: number;
    name: string;
    location: string;
    // faculty: Partial<Faculty>;
}

export interface Faculty {
    facultyId: number;
    name: string;
    location: string;
    phone: string;
    email: string;
    address: string;
    abbreviation: string;
}

export interface Production {
    productionId: number;
    workTitle: string;
    productionType: Partial<ProductionType>;
}

export interface ProductionType {
    typeProductionId: number;
    name: string;
    jsonStructure: string;
    alias: string;
    catalogsIds: string;
}

export interface StatusApplication {
    statusApplicationId: number;
    name: string;
    description: string;
}

export interface TeacherApplication {
    teacherApplicationId: number;
    typeOfRequestingTeacher: string;
    teacher: Partial<Teacher>;
}
