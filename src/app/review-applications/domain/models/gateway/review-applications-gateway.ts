import { Observable } from "rxjs";
import { GenericResponse } from "../../../../shared/utils/models/request-response.model";
import { ValidationApplication } from "../validation.model";
import { ApplicationStatuses } from "../../../../shared/utils/enums/review-applications.enum";
import { TeacherApplication } from "../../../../shared/utils/models/applications-common.model";

export abstract class ReviewApplicationsGateway {
    abstract getAllApplicationsByFacultyId(facultyId: number): Observable<GenericResponse>;
    abstract getAllApplicationsByFacultyIdAndSpecificStatus(facultyId: number, status: ApplicationStatuses): Observable<GenericResponse>;
    abstract getFileById(fileId: number): Observable<GenericResponse>;
    abstract saveValidationOfApplication(validation: Partial<ValidationApplication>): Observable<GenericResponse>;
    abstract updateApplicationState(applicationId: number, state: ApplicationStatuses): Observable<GenericResponse>;
    abstract getApplicationReviewByApplicationIdAndPersonId(applicationId: number, personId: number): Observable<GenericResponse>;
    abstract getApplicationReviewByApplicationId(applicationId: number): Observable<GenericResponse>;
    abstract savePointsApplicationRecognition(teacherApplication: Partial<TeacherApplication>): Observable<GenericResponse>;
    abstract updatePointsApplicationRecognition(teacherApplication: Partial<TeacherApplication>): Observable<GenericResponse>;
    /**
     * Casos de uso para el ciarp
    */
    abstract getAllApplicationsBySpecificStatus(status: ApplicationStatuses): Observable<GenericResponse>;
    abstract getPointsApplicationRecognition(teacherApplicationId: number): Observable<GenericResponse>;
}