import { FileRequest } from "./file.model";
import { Person } from "./person.model";
import { TeacherResponse } from "./teacher.model";

export interface ApplicationTemp {
    applicationTempId?: number;
    teacherId?: number;
    description?: string;
    numberOfAuthors?: number;
    termsAndConditions?: boolean;
    departmentId?: number;
    applicationTypeCatId?: number;
    productionTitle?: string;
    productionDisciplinaryArea?: string;
    productionNumberOfPages?: number;
    productionStartPage?: number;
    productionEndPage?: number;
    productionObservations?: string;
    productionTypeId?: number;
    productionJsonData?: string;
    productionPublicationMechanisms?: string;
}

export interface TeacherPersonUnifiedResponse {
    person: Person;
    teacher: TeacherResponse;
}

export interface ApplicationTypeJsonStructureResponse {
    jsonStructure: string;
}

export interface ApplicationRecognized {
    applicationRecognizedId?: number;
    title: string;
    resolutionName: string;
    date: string;
    authors: string;
    applicationId: number;
    teacher: TeacherResponse;
}

export interface ApplicationRequest {
    applicationTempId: number;
    productionFiles: FileRequest[];
}

export interface Application {
    applicationId: number;
    description: string;
    numberOfAuthors: number;
    termsAndConditions: boolean;
    applicationTypeCatId: number;
    applicationTypeName: string;
    createAt: string;
    production: Partial<Production>;
    applicationStatus: Partial<StatusApplication>;
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
