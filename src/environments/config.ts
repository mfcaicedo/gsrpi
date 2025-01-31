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

    //SYSTEM CONFIGURATION
    GET_ALL_FACULTIES: `${base_url_api_gsrpi}/obtener-facultades`,

}

export default ENVIRONMENTS;