export enum StepsReviewApplication {
    STEP_1_PERSONAL_INFORMATION_APPLICANT = 1,
    STEP_2_APPLICATION_RECOGNITION = 2,
    STEP_3_PRODUCTION_BY_TYPE = 3,
    STEP_4_APPLICATON_RECOGNIZED = 4,
    STEP_5_DOCUMENTS = 5,
}

export enum ValidationTypes {
    VALIDATION_PERSONAL_INFORMATION_APPLICANT = 'validacion_datos_personales_solicitante',
    VALIDATION_APPLICATION_RECOGNITION = 'validacion_solicitud_reconocimiento',
    VALIDATION_DEPENDENT_PRODUCTION_TYPE = 'validacion_produccion_dependiente_tipo',
    VALIDATION_RECOGNIZED_APPLICATIONS_RELATED_TO_CURRENT_APPLICATION = 'validacion_solicitudes_reconocidas_relacionadas_solicitud_actual',
    VALIDATION_PRODUCTION_FILES = 'validacion_archivos_produccion'
}

export enum ApplicationStatuses {
    SENT_TO_CPD = 'Enviada al CPD',
    REVIEWED_BY_CPD_SECRETARY = 'Revisada por: Secretaria CPD',
    RETURNED_IN_CPD = 'Devuelta en CPD',
    REVIEWED_BY_CPD_MEMBER = 'Revisada por: Miembro CPD',
    ENDORSED_BY_PRESIDENT_CPD = 'Avalada por: Presidente CPD',
    SEND_TO_CIARP = 'Enviada al CIARP',
    REVIEWED_BY_CIARP_SECRETARY = 'Revisada por: Secretaria CIARP',
    RETURNED_IN_CIARP = 'Devuelta en CIARP',
    REVIEWED_BY_CIARP_MEMBER = 'Revisada por: Miembro CIARP',
    ENDORSED_CIARP = 'Avalada CIARP', 
    REJECTED_CIARP = 'Rechazada CIARP',
    NONE = 'Ninguna'
}