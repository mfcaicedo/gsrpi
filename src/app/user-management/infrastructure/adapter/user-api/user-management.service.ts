import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserGateway } from '../../../domain/models/gateway/user-gateway';
import { UserListPaginated, User } from '../../../domain/models/user.model';
@Injectable({
  providedIn: 'root'
})
export class UserManagementService extends UserGateway {

  private urlBase = 'https://localhost:8080/gsrpi/api/v1';

  constructor(
    private readonly http: HttpClient
  ) {
    super();
  }

  override getAllUsersPaginated(): Observable<UserListPaginated[]> {
    // return this.http.get<UserListPaginated>(`${this.urlBase}/users-paginated`);
    const userListPaginated: UserListPaginated[] = [
      {
        userId: 1,
        name: 'User 1',
        email: 'mfcaicedo@gmail.com',
        telefono: '1234567890',
      },
    ];

    return of(userListPaginated);
  }
  override getUserById(id: number): Observable<User> {
    throw new Error('Method not implemented.');
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

}
