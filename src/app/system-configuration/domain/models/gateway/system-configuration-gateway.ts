import { Observable } from "rxjs";
import { FacultyListResponse } from "../faculty.model";

export abstract class SystemConfigurationGateway {
    abstract getAllFaculties(): Observable<FacultyListResponse[]>
}