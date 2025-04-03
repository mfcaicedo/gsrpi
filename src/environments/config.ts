import { ENVIRONMENT } from "./environment";

const base_url_api_gsrpi = ENVIRONMENT.BASE_URL_API_GSRPI;

const ENVIRONMENTS = {

    //Login 
    POST_LOGIN: `${base_url_api_gsrpi}/auth/login`,
    POST_LOGOUT: `${base_url_api_gsrpi}/auth/logout`,
    POST_REFRESH_TOKEN: `${base_url_api_gsrpi}/auth/refresh-token`,
    //Supabase auth
    BASE_URL_SUPABASE: ENVIRONMENT.BASE_URL_SUPABASE,
    PUBLIC_API_KEY_SUPABASE: ENVIRONMENT.PUBLIC_API_KEY_SUPABASE,

    //USER MANAGEMENT
    GET_USERS_PAGINATED: `${base_url_api_gsrpi}/obtener-usuarios-paginados`,
    GET_USER_BY_UID: `${base_url_api_gsrpi}/obtener-usuario-por-uid`,
    GET_USER_BY_ID: `${base_url_api_gsrpi}/obtener-usuario-por-id`,

    //SYSTEM CONFIGURATION
    GET_ALL_FACULTIES: `${base_url_api_gsrpi}/obtener-facultades`,
    CREATE_INITIAL_CONFIGURATION: `${base_url_api_gsrpi}/crear-configuracion`,
    GET_CONFIGURATION_BY_ID: `${base_url_api_gsrpi}/obtener-configuracion-por-id`,
    CREATE_CPD_MEMBER: `${base_url_api_gsrpi}/crear-persona`,

    //APPLICATION MANAGEMENT
    CREATE_TEMPORARY_APPLICATION: `${base_url_api_gsrpi}/crear-solicitud-temporal`,
    UPDATE_TEMPORARY_APPLICATION: `${base_url_api_gsrpi}/actualizar-solicitud-temporal`,
    CREATE_RECOGNIZED_APPLICATION: `${base_url_api_gsrpi}/crear-solicitud-reconocida`,
    UPDATE_RECOGNIZED_APPLICATION: `${base_url_api_gsrpi}/actualizar-solicitud-reconocida`,
    GET_RECOGNIZED_APPLICATION_BY_APPLICATION_ID: `${base_url_api_gsrpi}/obtener-solicitud-reconocida-por-solicitud-id`,
    CREATE_APPLICATION: `${base_url_api_gsrpi}/crear-solicitud`,
    GET_PRODUCTION_TYPE_BY_ALIAS: `${base_url_api_gsrpi}/obtener-tipo-produccion-por-alias`,
    GET_PRODUCTION_TYPE_BY_ID: `${base_url_api_gsrpi}/obtener-tipo-produccion-por-id`,
    GET_TEACHER_BY_PERSON_ID: `${base_url_api_gsrpi}/obtener-docente-por-id-persona`,
    GET_PERSON_BY_USER_ID: `${base_url_api_gsrpi}/obtener-persona-por-usuario-id`,
    GET_TEMPORARY_APPLICATION_BY_TEACHER_ID: `${base_url_api_gsrpi}/obtener-solicitud-temporal-por-docente-id`,
    GET_ALL_APPLICATIONS_BY_TEACHER_ID: `${base_url_api_gsrpi}/obtener-listado-solicitudes-por-docente-id`,
    GET_ALL_APPLICATIONS_BY_FACULTY_ID: `${base_url_api_gsrpi}/obtener-listado-solicitudes-por-facultad-id`,
    GET_APPLICATION_BY_ID: `${base_url_api_gsrpi}/obtener-solicitud-por-id`,

    //REVIEW APPLICATIONS
    SAVE_VALIDATION_OF_APPLICATION: `${base_url_api_gsrpi}/guardar-validacion`,
    UPDATE_APPLICATION_STATE: `${base_url_api_gsrpi}/actualizar-estado-solicitud`,
    GET_ALL_VALIDATIONS_BY_APPLICATION_ID_AND_PERSON_ID: `${base_url_api_gsrpi}/obtener-listado-validaciones-por-solicitud-id-y-persona-id`,
    GET_ALL_VALIDATIONS_BY_APPLICATION_ID: `${base_url_api_gsrpi}/obtener-listado-validaciones-por-solicitud-id`,
    GET_ALL_APPLICATIONS_BY_FACULTY_ID_AND_SPECIFIC_STATUS: `${base_url_api_gsrpi}/obtener-listado-solicitudes-por-facultad-id-y-estado-especifico`,
    SAVE_POINTS_APPLICATION_RECOGNITION: `${base_url_api_gsrpi}/guardar-puntos-reconocimiento-solicitud`,
    UPDATE_POINTS_APPLICATION_RECOGNITION: `${base_url_api_gsrpi}/actualizar-puntos-reconocimiento-solicitud`,
    GET_ALL_APPLICATIONS_BY_SPECIFIC_STATUS: `${base_url_api_gsrpi}/obtener-listado-solicitudes-por-estado-especifico`,
    GET_POINTS_APPLICATION_RECOGNITION: `${base_url_api_gsrpi}/obtener-puntos-reconocimiento-solicitud`,

    //FILE MANAGEMENT
    CREATE_FILE: `${base_url_api_gsrpi}/subir-archivo`,
    GET_FILE_BY_ID: `${base_url_api_gsrpi}/obtener-archivo-por-id`,
    BUCKED_NAME: 'gsrpi-storage',
}

export default ENVIRONMENTS;