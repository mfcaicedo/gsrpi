import { Routes } from "@angular/router";
import { CreateApplicationComponent } from "./UI/pages/create-application/create-application.component";
import { RegisterApplicantsComponent } from "./UI/pages/register-applicants/register-applicants.component";
import { RegisterGeneralProductionDataComponent } from "./UI/pages/register-general-production-data/register-general-production-data.component";
import { RegisterProductionTypeComponent } from "./UI/pages/register-production-type/register-production-type.component";
import { RegisterSpecificProductionDataComponent } from "./UI/pages/register-specific-production-data/register-specific-production-data.component";
import { RegisterRelatedWorksComponent } from "./UI/pages/register-related-works/register-related-works.component";
import { TermsAndConditionsComponent } from "./UI/pages/terms-and-conditions/terms-and-conditions.component";
import { UploadApplicationFilesComponent } from "./UI/pages/upload-application-files/upload-application-files.component";
import { ListApplicationsComponent } from "./UI/pages/list-applications/list-applications.component";
import { AuthorizedGuard } from "../auth/guards/authorized.guard";
import { RoleNames } from "../auth/enums/roles.enum";

export const routes: Routes = [
    {
        path: 'crear-solicitud',
        canActivate: [AuthorizedGuard],
        data: { roles: [RoleNames.TEACHER] },
        component: CreateApplicationComponent,
    },
    {
        path: 'registrar-solicitantes/step-2',
        canActivate: [AuthorizedGuard],
        data: { roles: [RoleNames.TEACHER] },
        component: RegisterApplicantsComponent
    },
    {
        path: 'registrar-datos-generales-produccion/step-3',
        canActivate: [AuthorizedGuard],
        data: { roles: [RoleNames.TEACHER] },
        component: RegisterGeneralProductionDataComponent
    },
    {
        path: 'registrar-tipo-produccion/step-4',
        canActivate: [AuthorizedGuard],
        data: { roles: [RoleNames.TEACHER] },
        component: RegisterProductionTypeComponent
    },
    {
        path: 'registrar-datos-especificos-produccion/step-5',
        canActivate: [AuthorizedGuard],
        data: { roles: [RoleNames.TEACHER] },
        component: RegisterSpecificProductionDataComponent
    },
    {
        path: 'registrar-trabajos-relacionados/step-6',
        canActivate: [AuthorizedGuard],
        data: { roles: [RoleNames.TEACHER] },
        component: RegisterRelatedWorksComponent
    }, 
    {
        path: 'terminos-condiciones/step-7',
        canActivate: [AuthorizedGuard],
        data: { roles: [RoleNames.TEACHER] },
        component: TermsAndConditionsComponent
    },
    {
        path: 'subir-archivos/step-8',
        canActivate: [AuthorizedGuard],
        data: { roles: [RoleNames.TEACHER] },
        component: UploadApplicationFilesComponent
    },
    {
        path: 'listar-solicitudes',
        canActivate: [AuthorizedGuard],
        data: { roles: [RoleNames.TEACHER] },
        component: ListApplicationsComponent
    }
];