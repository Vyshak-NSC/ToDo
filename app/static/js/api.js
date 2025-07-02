export const fetchTodosAPI = async (page=1,perPage=12) => {
    const response = await fetch(`/api/todos?page=${page}&per_page=${perPage}`)
    return response.json();
}

export const createTodoAPI = async (title,content) => {
    const response = await fetch('api/todos',{
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify({ title, content })
    });
    return response;
}

export const toggleTodoAPI = async (uid) => {
    const response = await fetch(`/api/todos/${uid}/toggle`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response;
}

export async function deleteTodoAPI(uid){
    const response = await fetch(`api/todos/${uid}`,{
        method:'DELETE'
    })
    .then(res => res.json())
}