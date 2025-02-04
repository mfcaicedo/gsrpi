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