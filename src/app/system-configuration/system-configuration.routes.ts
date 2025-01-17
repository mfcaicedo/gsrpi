import { Routes } from "@angular/router";
import { RegisterFacultyComponent } from "./UI/pages/register-faculty/register-faculty.component";
import { RegisterCpdMemberComponent } from "./UI/pages/register-cpd-member/register-cpd-member.component";
import { RegisterCiarpMemberComponent } from "./UI/pages/register-ciarp-member/register-ciarp-member.component";
import { RegisterCiarpSecretaryComponent } from "./UI/pages/register-ciarp-secretary/register-ciarp-secretary.component";
import { RegisterCpdSecretaryComponent } from "./UI/pages/register-cpd-secretary/register-cpd-secretary.component";

export const routes: Routes = [
    {
        path: 'registrar-facultad',
        component: RegisterFacultyComponent
    }, 
    {
        path: 'registrar-cpd',
        component: RegisterCpdMemberComponent
    }, 
    {
        path: 'registrar-secretaria-cpd',
        component: RegisterCpdSecretaryComponent
    },
    {
        path: 'registrar-ciarp',
        component: RegisterCiarpMemberComponent
    }, 
    {
        path: 'registrar-secretaria-ciarp',
        component: RegisterCiarpSecretaryComponent
    }
];