import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req, res) {
    const pathSegments = req.query.path || [];
    const path = Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments;

    const baseUrl = 'http://10.200.2.52:8080/gsrpi-api/v1';
    const url = `${baseUrl}/${path}`;

    try {
        const apiRes = await fetch(url, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
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
