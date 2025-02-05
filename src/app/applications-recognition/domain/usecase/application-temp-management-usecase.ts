import { Injectable, inject } from "@angular/core";
import { ApplicationsRecognitionGateway } from "../models/gateway/applications-recognition-gateway";
import { ApplicationTemp } from "../models/applications.model";

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

    getPersonByUserId(userId: number) {
        return this.applicationRecognitionGateway.getPersonByUserId(userId);
    }

    getTeacherByPersonId(personId: number) {
        return this.applicationRecognitionGateway.getTeacherByPersonId(personId);
    }

}
