import { Injectable } from "@angular/core";
import { SystemConfigurationGateway } from "../models/gateway/system-configuration-gateway";
import { Observable } from "rxjs";
import { FacultyDTO } from "../models/faculty.model";

@Injectable({
    providedIn: 'root'
})
export class ListFacultiesUsecase {

    constructor(private readonly systemConfigurationGateway: SystemConfigurationGateway) { }

    getAllFaculties(): Observable<FacultyDTO[]> {
        return this.systemConfigurationGateway.getAllFaculties();
    }

}