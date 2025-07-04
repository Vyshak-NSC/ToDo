import { handleAPIResponse } from "./utils.js";

export const fetchTodosAPI = async (page=1,perPage=12) => {
    const response = await fetch(`/api/todos?page=${page}&per_page=${perPage}`)
    return handleAPIResponse(response)
}

export const createTodoAPI = async (title,content) => {
    const response = await fetch('api/todos',{
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify({ title, content })
    });
    return handleAPIResponse(response)
}

export const toggleTodoAPI = async (uid) => {
    const response = await fetch(`/api/todos/${uid}/toggle`, {
        method: 'PATCH'
    });
    return handleAPIResponse(response)
}

export async function deleteTodoAPI(uid){
    const response = await fetch(`api/todos/${uid}`,{
        method:'DELETE'
    })
    return handleAPIResponse(response)
}

export async function getTodo(uid){
    const response = await fetch(`api/todos/${uid}`)
    return handleAPIResponse(response)
}