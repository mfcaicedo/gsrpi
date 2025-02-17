import { FileRequest } from "./file.model";
import { Person } from "../../../shared/utils/models/person.model";
import { Teacher } from "../../../shared/utils/models/teacher-common.model";

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
    teacher: Teacher;
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
    teacher: Teacher;
}

export interface ApplicationRequest {
    applicationTempId: number;
    productionFiles: FileRequest[];
}
