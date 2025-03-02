import { Observable } from "rxjs";
import { GenericResponse } from "../../../../shared/utils/models/request-response.model";

export abstract class ReviewApplicationsGateway {
    abstract getAllApplicationsByFacultyId(facultyId: number): Observable<GenericResponse>;
    abstract getFileById(fileId: number): Observable<GenericResponse>;
}