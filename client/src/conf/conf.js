const conf = {
    apiUrl: String(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, ''),
    serverUrl: String(import.meta.env.VITE_SERVER_URL || 'http://localhost:5000').replace(/\/+$/, ''),
}

export default conf