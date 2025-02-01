import { Observable } from "rxjs";
import { FacultyDTO } from "../faculty.model";
import { SystemConfigurationRequest } from "../system-configuration.model";
import { GenericResponse } from "../../../../shared/utils/models/request-response.model";
import { PersonRequest } from "../person.model";

export abstract class SystemConfigurationGateway {
    abstract getAllFaculties(): Observable<FacultyDTO[]>;
    abstract createInitialConfiguration(systemConfigurationRequest: SystemConfigurationRequest): Observable<GenericResponse>;
    abstract getConfigurationById(configurationId: number): Observable<GenericResponse>;
    abstract createPerson(personRequest: PersonRequest): Observable<GenericResponse>;
}