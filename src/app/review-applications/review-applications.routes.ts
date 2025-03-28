import { Routes } from "@angular/router";
import { ListApplicationsReviewComponent } from "./UI/pages/list-applications-review/list-applications-review.component";
import { ReviewApplicationComponent } from "./UI/pages/review-application/review-application.component";
import { ListApplicationsReviewCpdMembersComponent } from "./UI/pages/list-applications-review-cpd-members/list-applications-review-cpd-members.component";
import { RecommendPointsApplicationComponent } from "./UI/pages/recommend-points-application/recommend-points-application.component";
import { ViewApplicationDetailComponent } from "./UI/pages/view-application-detail/view-application-detail.component";

export const routes: Routes = [
    {
        path: 'listar-solicitudes-revision',
        component: ListApplicationsReviewComponent
    },
    {
        path: 'listar-solicitudes-revision-comite',
        component: ListApplicationsReviewCpdMembersComponent
    },
    {
        path: 'revisar-solicitud/:id',
        component: ReviewApplicationComponent
    },
    {
        path: 'recomendar-puntos/:applicationId/:teacherApplicationId',
        component: RecommendPointsApplicationComponent
    },
    {
        path: 'ver-detalle-solicitud/:id',
        component: ViewApplicationDetailComponent
    }
];