import { Observable } from "rxjs";
import { GenericResponse } from "../../../../shared/utils/models/request-response.model";
import { ValidationApplication } from "../validation.model";
import { ApplicationStatuses } from "../../../../shared/utils/enums/review-applications.enum";

export abstract class ReviewApplicationsGateway {
    abstract getAllApplicationsByFacultyId(facultyId: number): Observable<GenericResponse>;
    abstract getFileById(fileId: number): Observable<GenericResponse>;
    abstract saveValidationOfApplication(validation: Partial<ValidationApplication>): Observable<GenericResponse>;
    abstract updateApplicationState(applicationId: number, state: ApplicationStatuses): Observable<GenericResponse>;
    abstract getApplicationReviewByApplicationIdAndPersonId(applicationId: number, personId: number): Observable<GenericResponse>;
}