import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserGateway } from '../../../domain/models/gateway/user-gateway';
import { UserListPaginated, User } from '../../../domain/models/user.model';
import ENVIRONMENTS from '../../../../../environments/config';
import { GenericResponse } from '../../../../shared/utils/models/request-response.model';
@Injectable({
  providedIn: 'root'
})
export class UserManagementService extends UserGateway {

  constructor(
    private readonly http: HttpClient
  ) {
    super();
  }

  override getAllUsersPaginated(): Observable<UserListPaginated[]> {
    return this.http.get<UserListPaginated[]>(`${ENVIRONMENTS.GET_USERS_PAGINATED}`);
  }
  override getUserById(id: number): Observable<User> {
    throw new Error('Method not implemented.');
  }
  override getUserByUid(uid: string): Observable<User> {
    return this.http.get<User>(`${ENVIRONMENTS.GET_USER_BY_UID}/${uid}`);
  }
  override createUser(user: User): Observable<User> {
    throw new Error('Method not implemented.');
  }
  override updateUser(user: User): Observable<User> {
    throw new Error('Method not implemented.');
  }
  override deleteUser(id: number): Observable<User> {
    throw new Error('Method not implemented.');
  }

  override getPersonByUserId(userId: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(`${ENVIRONMENTS.GET_PERSON_BY_USER_ID}/${userId}`);
  }
  override getTeacherByPersonId(personId: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(`${ENVIRONMENTS.GET_TEACHER_BY_PERSON_ID}/${personId}`);
  }

}
