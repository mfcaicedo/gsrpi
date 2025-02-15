import { Observable } from "rxjs";
import { User, UserListPaginated } from "../user.model";
import { GenericResponse } from "../../../../shared/utils/models/request-response.model";

export abstract class UserGateway {
    abstract getAllUsersPaginated(): Observable<UserListPaginated[]>;
    abstract getUserById(id: number): Observable<User>;
    abstract getUserByUid(uid: string): Observable<User>;
    abstract createUser(user: User): Observable<User>;
    abstract updateUser(user: User): Observable<User>;
    abstract deleteUser(id: number): Observable<User>;
    abstract getPersonByUserId(userId: number): Observable<GenericResponse>;
    abstract getTeacherByPersonId(personId: number): Observable<GenericResponse>;
}