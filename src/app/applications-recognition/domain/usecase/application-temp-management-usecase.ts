import { Injectable, inject } from "@angular/core";
import { ApplicationsRecognitionGateway } from "../models/gateway/applications-recognition-gateway";
import { ApplicationRecognized, ApplicationRequest, ApplicationTemp } from "../models/applications.model";

@Injectable({
    providedIn: 'root'
})
export class ApplicationTempManagementUsecase {

    private readonly applicationRecognitionGateway = inject(ApplicationsRecognitionGateway);

    saveApplicationTemp(applicationRequestTemp: ApplicationTemp) {
        return this.applicationRecognitionGateway.saveApplicationTemp(applicationRequestTemp);
    }

    updateApplicationTemp(applicationRequestTemp: Partial<ApplicationTemp>) {
        return this.applicationRecognitionGateway.updateApplicationTemp(applicationRequestTemp);
    }

    getApplicationTempByTeacherId(teacherId: number) {
        return this.applicationRecognitionGateway.getApplicationTempByTeacherId(teacherId);
    }

}
