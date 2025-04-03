import { Injectable } from '@angular/core';
import { ReviewApplicationsGateway } from '../../../domain/models/gateway/review-applications-gateway';
import { Observable } from 'rxjs';
import { GenericResponse } from '../../../../shared/utils/models/request-response.model';
import { HttpClient } from '@angular/common/http';
import ENVIRONMENTS from '../../../../../environments/config';
import { ValidationApplication } from '../../../domain/models/validation.model';
import { ApplicationStatuses } from '../../../../shared/utils/enums/review-applications.enum';
import { Application, TeacherApplication } from '../../../../shared/utils/models/applications-common.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewApplicationsManagementService extends ReviewApplicationsGateway {

  constructor(
    private readonly http: HttpClient
  ) {
    super();
  }

  override getAllApplicationsByFacultyId(facultyId: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(`${ENVIRONMENTS.GET_ALL_APPLICATIONS_BY_FACULTY_ID}/${facultyId}`);
  }

  override getFileById(fileId: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(`${ENVIRONMENTS.GET_FILE_BY_ID}/${fileId}`);
  }

  override saveValidationOfApplication(validation: Partial<ValidationApplication>): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(ENVIRONMENTS.SAVE_VALIDATION_OF_APPLICATION, validation);
  }

  override updateApplicationState(applicationId: number, state: ApplicationStatuses): Observable<GenericResponse> {
    const bodyRequest: Partial<Application> = {
      applicationId: applicationId,
      applicationStatus: {
        name: state
      }
    }
    return this.http.put<GenericResponse>(`${ENVIRONMENTS.UPDATE_APPLICATION_STATE}`, bodyRequest);
  }

  override getApplicationReviewByApplicationIdAndPersonId(applicationId: number, personId: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(`${ENVIRONMENTS.GET_ALL_VALIDATIONS_BY_APPLICATION_ID_AND_PERSON_ID}/${applicationId}/${personId}`);
  }

  override getApplicationReviewByApplicationId(applicationId: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(`${ENVIRONMENTS.GET_ALL_VALIDATIONS_BY_APPLICATION_ID}/${applicationId}`);
  }

  override getAllApplicationsByFacultyIdAndSpecificStatus(facultyId: number, status: ApplicationStatuses): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(`${ENVIRONMENTS.GET_ALL_APPLICATIONS_BY_FACULTY_ID_AND_SPECIFIC_STATUS}/${facultyId}/${status}`);
  }

  override savePointsApplicationRecognition(teacherApplication: Partial<TeacherApplication>): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(ENVIRONMENTS.SAVE_POINTS_APPLICATION_RECOGNITION, teacherApplication)
  }

  override updatePointsApplicationRecognition(teacherApplication: Partial<TeacherApplication>): Observable<GenericResponse> {
    return this.http.put<GenericResponse>(ENVIRONMENTS.UPDATE_POINTS_APPLICATION_RECOGNITION, teacherApplication)
  }

  override getAllApplicationsBySpecificStatus(status: ApplicationStatuses): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(`${ENVIRONMENTS.GET_ALL_APPLICATIONS_BY_SPECIFIC_STATUS}/${status}`);
  }

  override getPointsApplicationRecognition(teacherApplicationId: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(`${ENVIRONMENTS.GET_POINTS_APPLICATION_RECOGNITION}/${teacherApplicationId}`);
  }

}
