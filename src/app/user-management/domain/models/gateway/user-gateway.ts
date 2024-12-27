import { Observable } from "rxjs";
import { User, UserListPaginated } from "../user.model";

export abstract class UserGateway {
    abstract getAllUsersPaginated(): Observable<UserListPaginated[]>;
    abstract getUserById(id: number): Observable<User>;
    abstract createUser(user: User): Observable<User>;
    abstract updateUser(user: User): Observable<User>;
    abstract deleteUser(id: number): Observable<User>;
}