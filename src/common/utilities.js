export const serverHost = 'https://ccrayp.onrender.com' //'http://127.0.0.1:8000'

export async function isTokenAvailable() {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        return false;
    }

    try {
        const response = await fetch(`${serverHost}/api/protected`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return expire_token(response);
    } catch (error) {
        console.error('Ошибка сети:', error);
        localStorage.removeItem('jwt_token');
        return false;
    }
}

export function expire_token(response) {
    const status = response.status
    if (status === 401) {
        localStorage.removeItem('jwt_token')
        return false
    }
    return true
}

export function removeJWTToken() {
    localStorage.removeItem('jwt_token')
    window.location.href = '/login'
}