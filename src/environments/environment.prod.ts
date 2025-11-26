export const ENVIRONMENT = {
    production: true,
    // BASE_URL_API_GSRPI: 'http://10.200.2.52:8080/gsrpi-api/v1',
    BASE_URL_API_GSRPI: 'https://gsrpi-api.onrender.com/gsrpi-api/v1',
    BASE_URL_SUPABASE: 'https://epouvlqgmorsqgzddwtn.supabase.co',
    PUBLIC_API_KEY_SUPABASE: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwb3V2bHFnbW9yc3FnemRkd3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNzE0MjAsImV4cCI6MjA3OTc0NzQyMH0.OkjwAuOWXayku0D6bbNblLKvl135PqAJ9UGl_wD6bJ8',
};

// 1. Realizar un despliegue en los servidores de UNICAUCA. 
// 2. Realizar una integración con servicios de las TIC (autenticación, migración de docentes, 
//     notificaciones, archivos) y posterior adecuar la API para la interoperabilidad con estos servicios.
// )
// 3. Pruebas con el usuario en en CPD de la Fiet (refactor de proyecto) --> no seran muchos 
// 4. El sistema permita hacer solicitudes de más tipos de producción (actualmente solo está revistas). 
// 5. CIARP -> Verificación de lo actual y realizar todo el proceso para las solicitudes en el CIARP 
