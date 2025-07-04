import { showErrorToast, socketSetup } from './utils.js'
import { fetchTodosAPI, toggleTodoAPI } from './api.js';
import { addTodoPopup, createTodoItem, openPopup } from './dom.js';

// Manage live updates
const socket = io({ transports:['websocket'] });
socketSetup(socket, loadTodos);


let currentPage = 1;
const perPage = 15;

export async function loadTodos(page=1){
    const container = document.getElementById('todo-list')
    try{
        const result = await fetchTodosAPI(page,perPage);

        const todos = result.todos;
        currentPage = result.page;

        if(todos.length === 0){
            container.innerHTML = `<p>No todos found!</p>`
            return;
        }

        // modify when adding filter/sort. else: pagination element is deleted
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


    if(current===totalPages){
        lastBtn.disabled = true;
    }
    if(totalPages===1){
        pagination.style.display = 'none'
    }else{
        pagination.style.display = ''
    }
    if(current > 1){
        prevBtn.onclick = () => loadTodos(current-1);
        firstBtn.onclick = () => loadTodos(1);
    }else{
        prevBtn.disabled = true;
    }

    if(current < totalPages){
        nextBtn.onclick = () => loadTodos(current+1)
        lastBtn.onclick = () => loadTodos(totalPages)
    }else{
        nextBtn.disabled = true;
    }

    container.appendChild(pagination);
}

document.addEventListener("DOMContentLoaded", () => {
    loadTodos();
    document.getElementById('add-todo').addEventListener('click',addTodoPopup);

    document.getElementById('todo-list').addEventListener('change', async function(e){
        if(e.target.type === 'checkbox'){
            const todoItem = e.target.closest('.todo-item')
            const todoId = todoItem?.id
            const todoCheckbox = e.target;

            try{
                const response = await toggleTodoAPI(todoId);
                todoCheckbox.checked = response.status;

                todoItem.classList.add('toggle-success')
                setTimeout(() => {
                    todoItem.classList.remove('toggle-success')
                }, 1400);
                
            }catch(error){
                todoItem.classList.add('toggle-error')
                todoCheckbox.checked = !todoCheckbox.checked;
                setTimeout(() => {
                    todoItem.classList.remove('toggle-error')
                },1400)
            }
        }
    })
})