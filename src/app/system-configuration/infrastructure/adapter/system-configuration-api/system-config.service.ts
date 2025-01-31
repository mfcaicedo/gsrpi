import { Injectable } from '@angular/core';
import { SystemConfigurationGateway } from '../../../domain/models/gateway/system-configuration-gateway';
import { Observable } from 'rxjs';
import { FacultyListResponse } from '../../../domain/models/faculty.model';
import { HttpClient } from '@angular/common/http';
import ENVIRONMENTS from '../../../../../environments/config';

@Injectable({
  providedIn: 'root'
})
export class SystemConfigService extends SystemConfigurationGateway {

  constructor(
    private readonly http: HttpClient
  ) {
    super();
  }

  override getAllFaculties(): Observable<FacultyListResponse[]> {
    return this.http.get<FacultyListResponse[]>(`${ENVIRONMENTS.GET_ALL_FACULTIES}`);
  }

}
