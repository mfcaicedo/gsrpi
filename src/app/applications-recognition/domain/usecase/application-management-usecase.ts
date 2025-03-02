import { inject, Injectable } from "@angular/core";
import { ApplicationsRecognitionGateway } from "../models/gateway/applications-recognition-gateway";
import { ApplicationRecognized, ApplicationRequest } from "../models/applications.model";
import { FileMetadata } from "../../../shared/utils/models/file-common.model";

@Injectable({
    providedIn: 'root'
})
export class ApplicationManagementUseCase {

    private readonly applicationRecognitionGateway = inject(ApplicationsRecognitionGateway);

    getPersonByUserId(userId: number) {
        return this.applicationRecognitionGateway.getPersonByUserId(userId);
    }

    getTeacherByPersonId(personId: number) {
        return this.applicationRecognitionGateway.getTeacherByPersonId(personId);
    }

    getProductionTypeJsonStructureById(productionTypeId: number) {
        return this.applicationRecognitionGateway.getProductionTypeJsonStructureById(productionTypeId);
    }

    createApplicationRecognized(applicationRecognized: ApplicationRecognized) {
        return this.applicationRecognitionGateway.createApplicationRecognized(applicationRecognized);
    }

    updateApplicationRecognized(applicationRecognized: Partial<ApplicationRecognized>) {
        return this.applicationRecognitionGateway.updateApplicationRecognized(applicationRecognized);
    }

    getApplicationRecognizedByApplicationId(applicationId: number) {
        return this.applicationRecognitionGateway.getApplicationRecognizedByApplicationId(applicationId);
    }

    saveMetadataFile(fileMetadataRequest: Partial<FileMetadata>) {
        return this.applicationRecognitionGateway.saveMetadataFile(fileMetadataRequest);
    }

    createApplication(applicationRequest: ApplicationRequest) {
        return this.applicationRecognitionGateway.createApplication(applicationRequest);
    }

    getAllAppicationsByTeacherId(teacherId: number) {
        return this.applicationRecognitionGateway.getAllAppicationsByTeacherId(teacherId);
    }

    getApplicationById(applicationId: number) {
        return this.applicationRecognitionGateway.getApplicationById(applicationId);
    }


}