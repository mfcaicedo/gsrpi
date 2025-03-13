import { Application } from "../../../shared/utils/models/applications-common.model";
import { Person } from "../../../shared/utils/models/person.model";

export interface ValidationApplication {
    validationId: number;
    validationState: boolean;
    observations: string;
    application: Partial<Application>;
    validationType: Partial<ValidationType>;
    person: Partial<Person>;
}

export interface ValidationType {
    validationTypeId: number;
    validationTypeName: string;
    description: string;
}