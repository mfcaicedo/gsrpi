import { inject, Injectable } from "@angular/core";
import { UserGateway } from "../models/gateway/user-gateway";

@Injectable({
    providedIn: 'root'
})
export class UserManagementUseCase {

    private readonly userGateway = inject(UserGateway);

    getUserByUid(uid: string) {
        return this.userGateway.getUserByUid(uid);
    }

    getPersonByUserId(userId: number) {
        return this.userGateway.getPersonByUserId(userId);
    }

    getTeacherByPersonId(personId: number) {
        return this.userGateway.getTeacherByPersonId(personId);
    }

}