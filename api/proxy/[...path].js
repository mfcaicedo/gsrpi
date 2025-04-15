export default async function handler(req, res) {
    const { path = [] } = req.query;

    // Convertir path en string completo
    const pathStr = Array.isArray(path) ? path.join('/') : path;

    // Construir la URL real hacia tu backend
    const targetUrl = `http://10.200.2.52:8080/gsrpi-api/v1/${pathStr}`;

    try {
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                ...req.headers,
                host: undefined // evita conflictos
            },
            body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? req.body : undefined
        });

        const contentType = response.headers.get('content-type');
        res.status(response.status);

        if (contentType?.includes('application/json')) {
            const data = await response.json();
            res.json(data);
        } else {
            const text = await response.text();
            res.send(text);
        }

    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Proxy failed', details: error.message });
    }
}