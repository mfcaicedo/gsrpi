import { Observable } from "rxjs";
import { ApplicationRequestTemp } from "../applications.model";
import { GenericResponse } from "../../../../shared/utils/models/request-response.model";

export abstract class ApplicationsRecognitionGateway {
    abstract saveApplicationTemp(applicationRequestTemp: ApplicationRequestTemp): Observable<GenericResponse>;
    abstract updateApplicationTemp(applicationRequestTemp: Partial<ApplicationRequestTemp>): Observable<GenericResponse>;
    abstract getApplicationTempByTeacherId(teacherId: number): Observable<GenericResponse>;
    abstract getPersonByUserId(userId: number): Observable<GenericResponse>;
    abstract getTeacherByPersonId(personId: number): Observable<GenericResponse>;
}