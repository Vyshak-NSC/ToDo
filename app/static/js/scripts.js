import { showErrorToast, socketSetup } from './utils.js'
import { fetchTodosAPI, toggleTodoAPI } from './api.js';
import { createTodoItem, openPopup } from './dom.js';

// Manage live updates
const socket = io({ transports:['websocket'] });
socketSetup(socket, fetchTodos);


let currentPage = 1;
const perPage = 12;

export async function fetchTodos(page=1){
    const container = document.getElementById('todo-list')
    try{
        const result = await fetchTodosAPI(page,perPage);

        const todos = result.todos;
        currentPage = result.page;

        if(todos.length === 0){
            container.innerHTML = `<p>No todos found!</p>`
            return;
        }
        container.innerHTML = ''

        todos.forEach(todo => {
            const item = createTodoItem(todo);
            container.appendChild(item)
        });

        displayPaginated(result.page, result.pages)
    }catch{
        container.innerHTML = 'Failed to load todos'
    }
}

function displayPaginated(current, totalPages){
    const container = document.getElementById('todo-list');
    const pagination = document.createElement('div');
    pagination.className = 'pagination';
    const isMobile = window.innerWidth <= 480;

    const prevBtn = document.createElement('button');
    const firstBtn = document.createElement('button');
    prevBtn.textContent  = isMobile ? '<' : 'Previous';
    firstBtn.textContent = isMobile ? '<<': 'First';

    const nextBtn = document.createElement('button');
    const lastBtn = document.createElement('button');
    nextBtn.textContent = isMobile ? '>' : 'Next';
    lastBtn.textContent = isMobile ? '>>' : 'Last';

    const pages = document.createElement('p')
    pages.textContent = `${current} of ${totalPages}`
    
    pagination.appendChild(firstBtn);
    pagination.appendChild(prevBtn);

    pagination.appendChild(pages);
    
    pagination.appendChild(nextBtn);
    pagination.appendChild(lastBtn);

    if(current > 1){
        prevBtn.onclick = () => fetchTodos(current-1);
        firstBtn.onclick = () => fetchTodos(1);
    }else{
        prevBtn.disabled = true;
    }

    if(current < totalPages){
        nextBtn.onclick = () => fetchTodos(current+1)
        lastBtn.onclick = () => fetchTodos(totalPages)
    }else{
        nextBtn.disabled = true;
    }

    container.appendChild(pagination);
}

document.addEventListener("DOMContentLoaded", () => {
    fetchTodos();
    document.getElementById('add-todo').addEventListener('click',openPopup);

    document.getElementById('todo-list').addEventListener('change', async function(e){
        if(e.target.type === 'checkbox'){
            const todoItem = e.target.closest('.todo-item')
            const todoId = todoItem?.id
            const todoCheckbox = e.target;

            try{
                const response = await toggleTodoAPI(todoId);
                if(!response.ok){
                    let errorMsg = 'Failed to toggle item.';
                    try {
                        const errJson = await response.json();
                        errorMsg = errJson.error || JSON.stringify(errJson);
                    } catch {
                        const fallback = await response.text();
                        errorMsg = fallback;
                    }
                    showErrorToast(errorMsg);
                }else{
                    const data = await response.json();
                    todoCheckbox.checked = data.status;
                    
                    todoItem.classList.add('success-toggle');
                    setTimeout(() => {
                        todoItem.classList.remove('success-toggle')
                    },1400)
                }
                
            }catch(error){
                todoItem.classList.add('error-toggle')
                todoCheckbox.checked = !todoCheckbox.checked;
                setTimeout(() => {
                    todoItem.classList.remove('error-toggle')
                },1400)
            }
        }
    })
})