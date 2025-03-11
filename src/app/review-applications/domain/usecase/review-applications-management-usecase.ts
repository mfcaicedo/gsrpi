import { inject, Injectable } from "@angular/core";
import { ReviewApplicationsGateway } from "../models/gateway/review-applications-gateway";
import { ValidationApplication } from "../models/validation.model";
import { ApplicationStatuses } from "../../../shared/utils/enums/review-applications.enum";

@Injectable({
    providedIn: 'root'
})
export class ReviewApplicationsManagementUseCase {

    private readonly reviewApplicationsGateway = inject(ReviewApplicationsGateway);

    getAllApplicationsByFacultyId(facultyId: number) {
        return this.reviewApplicationsGateway.getAllApplicationsByFacultyId(facultyId);
    }

    getFileById(fileId: number) {
        return this.reviewApplicationsGateway.getFileById(fileId);
    }

    saveValidationOfApplication(validation: Partial<ValidationApplication>) {
        return this.reviewApplicationsGateway.saveValidationOfApplication(validation);
    }

    updateApplicationState(applicationId: number, state: ApplicationStatuses) {
        return this.reviewApplicationsGateway.updateApplicationState(applicationId, state);
    }

}
