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

export const routes: Routes = [
    {
        path: 'crear-solicitud',
        component: CreateApplicationComponent,
    },
    {
        path: 'registrar-solicitantes/step-2',
        component: RegisterApplicantsComponent
    },
    {
        path: 'registrar-datos-generales-produccion/step-3',
        component: RegisterGeneralProductionDataComponent
    },
    {
        path: 'registrar-tipo-produccion/step-4',
        component: RegisterProductionTypeComponent
    },
    {
        path: 'registrar-datos-especificos-produccion/step-5',
        component: RegisterSpecificProductionDataComponent
    },
    {
        path: 'registrar-trabajos-relacionados/step-6',
        component: RegisterRelatedWorksComponent
    }, 
    {
        path: 'terminos-condiciones/step-7',
        component: TermsAndConditionsComponent
    },
    {
        path: 'subir-archivos/step-8',
        component: UploadApplicationFilesComponent
    },
    {
        path: 'listar-solicitudes',
        component: ListApplicationsComponent
    }
];