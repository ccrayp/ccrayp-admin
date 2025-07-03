import { isTokenAvailable } from "../common/utilities";
import { serverHost } from "../common/utilities";

export async function getData({ navigate, setIsLoading, setData, tableName }) {
    setIsLoading(true)

    if (!await isTokenAvailable()) {
        navigate('/login')
        return
    }

    try {
        const response = await fetch(`${serverHost}/api/${tableName}/list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 404)
            return []
        else if (response.status === 500)
            return (await response.json()).error

        const data = await response.json()
        setData(Array.isArray(data) ? data : [])
    } catch (error) {
        console.error("Ошибка загрузки достижений:", error)
        setData([])
    } finally {
        setIsLoading(false)
    }
}

export async function getTableItemByID(id, tableName) {
    const token = localStorage.getItem('jwt_token');
    const response = await fetch(`${serverHost}/api/${tableName}/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })

    if (response.status === 404) {
        console.log((await response.json()).message)
        return {}
    }
    else if (response.status === 500)
        return (await response.json()).error

    return await response.json()
}

export async function deleteTableItemById(id, tableName) {
    const token = localStorage.getItem('jwt_token');
    return await fetch(`${serverHost}/api/${tableName}/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
}

export async function updateTableItemById(id, data, tableName) {
    const token = localStorage.getItem('jwt_token');
    return await fetch(`${serverHost}/api/${tableName}/update/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: data
    })
}

export async function newTableItemByData(data, tableName) {
    const token = localStorage.getItem('jwt_token');
    return await fetch(`${serverHost}/api/${tableName}/new`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: data
    })
}