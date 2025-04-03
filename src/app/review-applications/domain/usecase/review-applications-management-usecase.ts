import { inject, Injectable } from "@angular/core";
import { ReviewApplicationsGateway } from "../models/gateway/review-applications-gateway";
import { ValidationApplication } from "../models/validation.model";
import { ApplicationStatuses } from "../../../shared/utils/enums/review-applications.enum";
import { TeacherApplication } from "../../../shared/utils/models/applications-common.model";

@Injectable({
    providedIn: 'root'
})
export class ReviewApplicationsManagementUseCase {

    private readonly reviewApplicationsGateway = inject(ReviewApplicationsGateway);

    getAllApplicationsByFacultyId(facultyId: number) {
        return this.reviewApplicationsGateway.getAllApplicationsByFacultyId(facultyId);
    }

    getAllApplicationsByFacultyIdAndSpecificStatus(facultyId: number, status: ApplicationStatuses) {
        return this.reviewApplicationsGateway.getAllApplicationsByFacultyIdAndSpecificStatus(facultyId, status);
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

    getApplicationReviewByApplicationIdAndPersonId(applicationId: number, personId: number) {
        return this.reviewApplicationsGateway.getApplicationReviewByApplicationIdAndPersonId(applicationId, personId);
    }

    getApplicationReviewByApplicationId(applicationId: number) {
        return this.reviewApplicationsGateway.getApplicationReviewByApplicationId(applicationId);
    }

    savePointsApplicationRecognition(teacherApplication: Partial<TeacherApplication>){
        return this.reviewApplicationsGateway.savePointsApplicationRecognition(teacherApplication);
    }

    updatePointsApplicationRecognition(teacherApplication: Partial<TeacherApplication>){
        return this.reviewApplicationsGateway.updatePointsApplicationRecognition(teacherApplication);
    }
    /**
     * Casos de uso para el ciarp
     */
    getAllApplicationsBySpecificStatus(status: ApplicationStatuses) {
        return this.reviewApplicationsGateway.getAllApplicationsBySpecificStatus(status);
    }

    getPointsApplicationRecognition(teacherApplicationId: number) {
        return this.reviewApplicationsGateway.getPointsApplicationRecognition(teacherApplicationId);
    }

}
