import { Observable } from "rxjs";
import { ApplicationTemp } from "../applications.model";
import { GenericResponse } from "../../../../shared/utils/models/request-response.model";

export abstract class ApplicationsRecognitionGateway {
    abstract saveApplicationTemp(applicationRequestTemp: ApplicationTemp): Observable<GenericResponse>;
    abstract updateApplicationTemp(applicationRequestTemp: Partial<ApplicationTemp>): Observable<GenericResponse>;
    abstract getApplicationTempByTeacherId(teacherId: number): Observable<GenericResponse>;
    abstract getPersonByUserId(userId: number): Observable<GenericResponse>;
    abstract getTeacherByPersonId(personId: number): Observable<GenericResponse>;
}