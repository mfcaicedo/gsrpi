import { Routes } from "@angular/router";
import { ListApplicationsReviewComponent } from "./UI/pages/list-applications-review/list-applications-review.component";
import { ReviewApplicationComponent } from "./UI/pages/review-application/review-application.component";

export const routes: Routes = [
    {
        path: 'listar-solicitudes-revision',
        component: ListApplicationsReviewComponent
    },
    {
        path: 'revisar-solicitud/:id',
        component: ReviewApplicationComponent
    }
];