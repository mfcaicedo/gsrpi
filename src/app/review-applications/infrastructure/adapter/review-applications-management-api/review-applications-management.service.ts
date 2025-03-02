import { Injectable } from '@angular/core';
import { ReviewApplicationsGateway } from '../../../domain/models/gateway/review-applications-gateway';
import { Observable } from 'rxjs';
import { GenericResponse } from '../../../../shared/utils/models/request-response.model';
import { HttpClient } from '@angular/common/http';
import ENVIRONMENTS from '../../../../../environments/config';

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

}
