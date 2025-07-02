import { createTodoAPI } from "./api.js";

export function showErrorToast(message) {
    const toast = document.getElementById('error-toast');
    toast.textContent = message;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
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

    if(!title || !content){
        onError?.('Both Title and Content required');
    }
    try{
        const res = await createTodoAPI(title,content)
        if(!res.ok){
            const e = await res.json();
            onError?.(e.error || 'An error occured.')
            return;
        }
        onSuccess?.();
    }catch{
        onError?.("An error occured.")
    }
}