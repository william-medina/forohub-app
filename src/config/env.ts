export const AppConfig = {
    isMicroservices: import.meta.env.VITE_IS_MICROSERVICES === 'true',
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    authUrl: import.meta.env.VITE_AUTH_URL || 'http://localhost:9000',
    tokenUrl: import.meta.env.VITE_TOKEN_URL || 'http://localhost:9001/token',
    clientId: import.meta.env.VITE_OAUTH2_CLIENT_ID || '',
};