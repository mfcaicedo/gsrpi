export default async function handler(req, res) {
    const pathSegments = req.query.path || [];
    const path = pathSegments.join('/');

    // Reemplaza esto con la URL base de tu API HTTP
    const baseUrl = 'http://10.200.2.52:8080/gsrpi-api/v1';
    const url = `${baseUrl}/${path}`;

    console.log(`Proxying request to: ${url}`);

    try {
        const apiRes = await fetch(url, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                // Puedes copiar otras cabeceras si es necesario
            },
            body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
        });

        const data = await apiRes.json();
        return res.status(apiRes.status).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({ error: 'Error en el proxy de API', details: error.message });
    }
}