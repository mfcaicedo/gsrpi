import { Routes } from "@angular/router";
import { ListApplicationsReviewComponent } from "./UI/pages/list-applications-review/list-applications-review.component";
import { ReviewApplicationComponent } from "./UI/pages/review-application/review-application.component";
import { ListApplicationsReviewCpdMembersComponent } from "./UI/pages/list-applications-review-cpd-members/list-applications-review-cpd-members.component";
import { RecommendPointsApplicationComponent } from "./UI/pages/recommend-points-application/recommend-points-application.component";
import { ViewApplicationDetailComponent } from "./UI/pages/view-application-detail/view-application-detail.component";
import { ListApplicationsReviewCiarpMembersComponent } from "./UI/pages/ciarp/list-applications-review-ciarp-members/list-applications-review-ciarp-members.component";
import { ListApplicationsReviewCiarpSecretaryComponent } from "./UI/pages/ciarp/list-applications-review-ciarp-secretary/list-applications-review-ciarp-secretary.component";
import { AssignPointsApplicationComponent } from "./UI/pages/ciarp/assign-points-application/assign-points-application.component";
import { AssignPointsApplicationDetailComponent } from "./UI/pages/ciarp/assign-points-application-detail/assign-points-application-detail.component";
import { CreateResolutionComponent } from "./UI/pages/ciarp/create-resolution/create-resolution.component";
import { AgendaManagementComponent } from "./UI/pages/agenda-management/agenda-management.component";
import { CreateCertificateComponent } from "./UI/pages/cpd/create-certificate/create-certificate.component";

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
        path: 'recomendar-puntos/:applicationId/:teacherApplicationId/:isViewDetail',
        component: RecommendPointsApplicationComponent
    },
    {
        path: 'ver-detalle-solicitud/:id',
        component: ViewApplicationDetailComponent
    },
    {
        path: 'listar-solicitudes-revision-ciarp',
        component: ListApplicationsReviewCiarpSecretaryComponent
    },
    {
        path: 'listar-solicitudes-revision-comite-ciarp',
        component: ListApplicationsReviewCiarpMembersComponent
    },
    {
        path: 'asignar-puntos/:applicationId/:teacherApplicationId/:isViewDetail',
        component: AssignPointsApplicationComponent
    },
    {
        path: 'ver-detalle-puntos-asignados/:applicationId/:teacherApplicationId',
        component: AssignPointsApplicationDetailComponent
    },
    {
        path: 'crear-resolucion/:applicationId',
        component: CreateResolutionComponent
    },
    {
        path: 'gestionar-agenda',
        component: AgendaManagementComponent
    },
    {
        path: 'crear-acta/:applicationId',
        component: CreateCertificateComponent
    }

];