import { FileMetadata } from "./file-common.model";
import { Teacher } from "./teacher-common.model";

export interface Application {
    applicationId: number;
    description: string;
    numberOfAuthors: number;
    termsAndConditions: boolean;
    applicationTypeCatId: number;
    applicationTypeName: string;
    createAt: string;
    updateAt: string;
    ciarpSendDate: string;
    department: Partial<Department>;
    production: Partial<Production>;
    applicationStatus: Partial<StatusApplication>;
    teacherApplications: Partial<TeacherApplication>[];
    nombresSolicitante: string;
}

export interface Department {
    departmentId: number;
    name: string;
    location: string;
    faculty: Partial<Faculty>;
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
    dataJson: string;
    disciplinaryArea: string;
    endPage: number;
    numberOfPages: number;
    observations: string;
    publicationMechanism: string;
    startPage: number;
    productionFiles: Partial<ProductionFile[]>;
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
    recommendedPoints: number;
    assignedPoints: number;
    teacher: Partial<Teacher>;
}

export interface ProductionFile {
    fileId: number;
    name: string;
    productionFileId: number;
    fileMetadata: FileMetadata
}
