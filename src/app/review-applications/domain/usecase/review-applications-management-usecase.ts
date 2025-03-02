import { inject, Injectable } from "@angular/core";
import { ReviewApplicationsGateway } from "../models/gateway/review-applications-gateway";

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

}
