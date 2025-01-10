import { ENVIRONMENT } from "./environment";

const base_url_api_gsrpi = ENVIRONMENT.BASE_URL_API_GSRPI;

const ENVIRONMENTS = {
    
    //Login 
    POST_LOGIN: `${base_url_api_gsrpi}/auth/login`,
    POST_LOGOUT: `${base_url_api_gsrpi}/auth/logout`,
    POST_REFRESH_TOKEN: `${base_url_api_gsrpi}/auth/refresh-token`,

}

export default ENVIRONMENTS;