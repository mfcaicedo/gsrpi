import { Observable } from "rxjs";
import { ApplicationRecognized, ApplicationRequest, ApplicationTemp } from "../applications.model";
import { GenericResponse } from "../../../../shared/utils/models/request-response.model";
import { FileMetadata } from "../../../../shared/utils/models/file-common.model";

export abstract class ApplicationsRecognitionGateway {
    abstract saveApplicationTemp(applicationRequestTemp: ApplicationTemp): Observable<GenericResponse>;
    abstract updateApplicationTemp(applicationRequestTemp: Partial<ApplicationTemp>): Observable<GenericResponse>;
    abstract getApplicationTempByTeacherId(teacherId: number): Observable<GenericResponse>;
    abstract getPersonByUserId(userId: number): Observable<GenericResponse>;
    abstract getTeacherByPersonId(personId: number): Observable<GenericResponse>;
    abstract getProductionTypeJsonStructureById(productionTypeId: number): Observable<GenericResponse>;
    abstract createApplicationRecognized(applicationRecognized: ApplicationRecognized): Observable<GenericResponse>;
    abstract updateApplicationRecognized(applicationRecognized: Partial<ApplicationRecognized>): Observable<GenericResponse>;
    abstract getApplicationRecognizedByApplicationId(applicationId: number): Observable<GenericResponse>;
    abstract saveMetadataFile(fileMetadataRequest: Partial<FileMetadata>): Observable<GenericResponse>;
    abstract createApplication(applicationRequest: ApplicationRequest): Observable<GenericResponse>;
    abstract getAllAppicationsByTeacherId(teacherId: number): Observable<GenericResponse>;
    abstract getApplicationById(application: number): Observable<GenericResponse>;
}