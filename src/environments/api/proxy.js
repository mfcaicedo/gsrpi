export default async function handler(req, res) {
    const url = 'http://10.200.2.52:8080/gsrpi-api/v1' + req.url;

    const apiRes = await fetch(url, {
        method: req.method,
        headers: {
            ...req.headers,
            host: undefined // evitar conflicto
        },
        body: req.method !== 'GET' ? req.body : undefined
    });

    const data = await apiRes.text();
    res.status(apiRes.status).send(data);
}