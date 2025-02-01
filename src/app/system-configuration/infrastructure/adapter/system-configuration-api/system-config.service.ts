import { Injectable } from '@angular/core';
import { SystemConfigurationGateway } from '../../../domain/models/gateway/system-configuration-gateway';
import { Observable } from 'rxjs';
import { FacultyDTO } from '../../../domain/models/faculty.model';
import { HttpClient } from '@angular/common/http';
import ENVIRONMENTS from '../../../../../environments/config';
import { GenericResponse } from '../../../../shared/utils/models/request-response.model';
import { SystemConfigurationRequest } from '../../../domain/models/system-configuration.model';
import { PersonRequest } from '../../../domain/models/person.model';

@Injectable({
  providedIn: 'root'
})
export class SystemConfigService extends SystemConfigurationGateway {

  constructor(
    private readonly http: HttpClient
  ) {
    super();
  }

  override getAllFaculties(): Observable<FacultyDTO[]> {
    return this.http.get<FacultyDTO[]>(`${ENVIRONMENTS.GET_ALL_FACULTIES}`);
  }

  override createInitialConfiguration(systemConfigurationRequest: SystemConfigurationRequest): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(`${ENVIRONMENTS.CREATE_INITIAL_CONFIGURATION}`, systemConfigurationRequest);
  }

  override getConfigurationById(configurationId: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(`${ENVIRONMENTS.GET_CONFIGURATION_BY_ID}/${configurationId}`);
  }

  override createPerson(personRequest: PersonRequest): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(`${ENVIRONMENTS.CREATE_CPD_MEMBER}`, personRequest);
  }

}
