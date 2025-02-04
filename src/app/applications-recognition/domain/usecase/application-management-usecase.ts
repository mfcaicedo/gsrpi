import { inject, Injectable } from "@angular/core";
import { ApplicationsRecognitionGateway } from "../models/gateway/applications-recognition-gateway";

@Injectable({
    providedIn: 'root'
})
export class ApplicationManagementUseCase {

    private readonly applicationRecognitionGateway = inject(ApplicationsRecognitionGateway);

    getPersonByUserId(userId: number) {
        return this.applicationRecognitionGateway.getPersonByUserId(userId);
    }

}