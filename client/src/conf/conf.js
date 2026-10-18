const conf = {
    apiUrl: String(import.meta.env.VITE_API_URL || 'http://localhost:5000/api'),
    serverUrl: String(import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'),
}

export default conf