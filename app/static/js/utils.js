import { createTodoAPI, editTodoAPI } from "./api.js";

export function showErrorToast(message) {
    const toast = document.getElementById('error-toast');
    toast.textContent = message;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

export async function handleAPIResponse(response){
    let data;
    try {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            data = { error: text || 'Unknown error' };
        }
    } catch (err) {
        throw new Error('Invalid response from server');
    }

    if (!response.ok) {
        console.error('Server error:', data);
        throw new Error(data.error || 'An error occurred');
    }
    return data;
}

export const socketSetup = (socket, refresh) => {
    socket.on('todo_event', (data) => {
        const {action} = data;
        if(['created','updated','deleted'].includes(action)){
            setTimeout(refresh, 1500);
        }
    });
}

export const createTodo = async ({onSuccess, onError}) => {
    const title = document.getElementById('title-input').value.trim();
    const content = document.getElementById('content-input').value.trim();

    if(!title){
        onError?.('Title required');
        return;
    } 
    try{
        await createTodoAPI(title,content)
        onSuccess?.();
    }catch{
        onError?.("An error occured.")
    }
}

export const editTodo = async ({uid, onSuccess, onError}) => {
    const title = document.getElementById('title-input').value.trim();
    const content = document.getElementById('content-input').value.trim();

    if(!title){
        onError?.("Title required");
        return;
    }
    try{
        await editTodoAPI(uid, title,content);
        onSuccess?.();
    }catch{
        onError?.('An error occured')
    }
}