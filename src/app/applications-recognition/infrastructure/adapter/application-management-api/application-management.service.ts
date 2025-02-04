import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApplicationsRecognitionGateway } from '../../../domain/models/gateway/applications-recognition-gateway';
import { Observable } from 'rxjs';
import { GenericResponse } from '../../../../shared/utils/models/request-response.model';
import { ApplicationRequestTemp } from '../../../domain/models/applications.model';
import ENVIRONMENTS from '../../../../../environments/config';

@Injectable({
  providedIn: 'root'
})
export class ApplicationManagementService extends ApplicationsRecognitionGateway {

  constructor(
    private readonly http: HttpClient
  ) {
    super();
  }

  override saveApplicationTemp(applicationRequestTemp: ApplicationRequestTemp): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(ENVIRONMENTS.CREATE_TEMPORARY_APPLICATION, applicationRequestTemp);
  }

  override updateApplicationTemp(applicationRequestTemp: Partial<ApplicationRequestTemp>): Observable<GenericResponse> {
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

}
