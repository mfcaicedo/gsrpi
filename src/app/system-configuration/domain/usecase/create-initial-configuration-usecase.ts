import { Injectable } from "@angular/core";
import { SystemConfigurationGateway } from "../models/gateway/system-configuration-gateway";
import { Observable } from "rxjs";
import { SystemConfigurationRequest } from "../models/system-configuration.model";
import { GenericResponse } from "../../../shared/utils/models/request-response.model";
import { PersonRequest } from "../models/person.model";

@Injectable({
    providedIn: 'root'
})
export class CreateInitialConfigurationUsecase {

    constructor(private readonly systemConfigurationGateway: SystemConfigurationGateway) { }

    createInitialConfiguration(systemConfigurationRequest: SystemConfigurationRequest): Observable<GenericResponse> {
        return this.systemConfigurationGateway.createInitialConfiguration(systemConfigurationRequest);
    }

    getConfigurationById(configurationId: number): Observable<GenericResponse> {
        return this.systemConfigurationGateway.getConfigurationById(configurationId);
    }

    createPerson(personRequest: PersonRequest): Observable<GenericResponse> {
        return this.systemConfigurationGateway.createPerson(personRequest);
    }

}