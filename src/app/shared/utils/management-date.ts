/**
 * función que retorna la fecha actual en tu zona horaria en formato YYYY-MM-DDTHH:MM:SS
 * @returns fecha actual en tu zona horaria en formato YYYY-MM-DDTHH:MM:SS
 */
export function getCurrentDate() {
    const date = new Date();
    return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0') + 'T' +
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0') + ':' +
        String(date.getSeconds()).padStart(2, '0')
}
