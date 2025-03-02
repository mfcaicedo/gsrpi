import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApplicationsRecognitionGateway } from '../../../domain/models/gateway/applications-recognition-gateway';
import { Observable } from 'rxjs';
import { GenericResponse } from '../../../../shared/utils/models/request-response.model';
import { ApplicationRecognized, ApplicationRequest, ApplicationTemp } from '../../../domain/models/applications.model';
import ENVIRONMENTS from '../../../../../environments/config';
import { FileMetadata } from '../../../../shared/utils/models/file-common.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationManagementService extends ApplicationsRecognitionGateway {

  constructor(
    private readonly http: HttpClient
  ) {
    super();
  }

  override saveApplicationTemp(applicationRequestTemp: ApplicationTemp): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(ENVIRONMENTS.CREATE_TEMPORARY_APPLICATION, applicationRequestTemp);
  }

  override updateApplicationTemp(applicationRequestTemp: Partial<ApplicationTemp>): Observable<GenericResponse> {
    return this.http.patch<GenericResponse>(ENVIRONMENTS.UPDATE_TEMPORARY_APPLICATION, applicationRequestTemp);
  }

  override getApplicationTempByTeacherId(teacherId: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(`${ENVIRONMENTS.GET_TEMPORARY_APPLICATION_BY_TEACHER_ID}/${teacherId}`);
  }

  override getPersonByUserId(userId: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(`${ENVIRONMENTS.GET_PERSON_BY_USER_ID}/${userId}`);
  }

  override getTeacherByPersonId(personId: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(`${ENVIRONMENTS.GET_TEACHER_BY_PERSON_ID}/${personId}`);
  }

  override getProductionTypeJsonStructureById(productionTypeId: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(`${ENVIRONMENTS.GET_PRODUCTION_TYPE_BY_ID}/${productionTypeId}`);
  }

  override createApplicationRecognized(applicationRecognized: ApplicationRecognized): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(ENVIRONMENTS.CREATE_RECOGNIZED_APPLICATION, applicationRecognized);
  }

  override updateApplicationRecognized(applicationRecognized: Partial<ApplicationRecognized>): Observable<GenericResponse> {
    return this.http.patch<GenericResponse>(ENVIRONMENTS.UPDATE_RECOGNIZED_APPLICATION, applicationRecognized);
  }

  override getApplicationRecognizedByApplicationId(applicationId: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(`${ENVIRONMENTS.GET_RECOGNIZED_APPLICATION_BY_APPLICATION_ID}/${applicationId}`);
  }

  override saveMetadataFile(fileMetadataRequest: FileMetadata): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(ENVIRONMENTS.CREATE_FILE, fileMetadataRequest);
  }

  override createApplication(applicationRequest: ApplicationRequest): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(ENVIRONMENTS.CREATE_APPLICATION, applicationRequest);
  }

  override getAllAppicationsByTeacherId(teacherId: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(`${ENVIRONMENTS.GET_ALL_APPLICATIONS_BY_TEACHER_ID}/${teacherId}`);
  }

  override getApplicationById(applicationId: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(`${ENVIRONMENTS.GET_APPLICATION_BY_ID}/${applicationId}`);
  }

}
