import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserGateway } from '../models/gateway/user-gateway';

@Injectable({
    providedIn: 'root'
})
export class ListUsersUsecase {

    constructor(private userGateway: UserGateway) { }

    getAllUsersPaginated(): Observable<any> {
        return this.userGateway.getAllUsersPaginated();
    }

}