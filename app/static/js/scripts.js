// Manage live updates
const socket = io({
    transports:['websocket']
});
socket.on('todo_update', (data) => {
    setTimeout(fetchTodos, 1500);
});

let currentPage = 1;
const perPage = 5;

async function fetchTodos(page=1){
    const container = document.getElementById('todo-list')
    try{
        const response = await fetch(`/api/todos?page=${page}&per_page=${perPage}`);
        const result = await response.json();

        const todos = result.todos;
        currentPage = result.page;

        if(todos.length === 0){
            container.innerHTML = `<p>No todos found!</p>`
            return;
        }
        container.innerHTML = ''

        todos.forEach(todo => {
            const item = document.createElement('div');
            item.classList.add('todo-item');
            item.id = todo.uid;
            
            const timestmp = document.createElement('p');
            timestmp.classList.add('todo-timestmp');
            timestmp.textContent = `${todo.date}`
            
            const title = document.createElement('p');
            title.classList.add('todo-title');
            title.textContent = `${todo.title}`;

            const content = document.createElement('div');
            content.classList.add('todo-content');
            
            const text = document.createElement('p');
            text.classList.add('todo-text');
            text.textContent = `${todo.content}`

            const status = document.createElement('div');
            status.classList.add('todo-status');
            status.innerHTML =`
                <label class="circle-checkbox">
                <input type="checkbox" id="todo-${todo.uid}" ${todo.status ? "checked" : ""}>
                <span></span>
                </label>
            `
            content.appendChild(timestmp);
            content.appendChild(title);
            content.appendChild(text);
            
            item.appendChild(content);
            item.appendChild(status);

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

    if(current > 1){
        const prevBtn = document.createElement('button');
        const firstBtn = document.createElement('button');
        prevBtn.textContent = 'Previous';
        firstBtn.textContent = 'First';

        prevBtn.onclick = () => fetchTodos(current-1);
        firstBtn.onclick = () => fetchTodos(1);
        
        pagination.appendChild(firstBtn);
        pagination.appendChild(prevBtn);
    }

    if(current < totalPages){
        const nextBtn = document.createElement('button');
        const lastBtn = document.createElement('button');
        nextBtn.textContent = 'Next';
        lastBtn.textContent = 'Last';

        nextBtn.onclick = () => fetchTodos(current+1)
        lastBtn.onclick = () => fetchTodos(totalPages)

        pagination.appendChild(nextBtn);
        pagination.appendChild(lastBtn);
    }

    container.appendChild(pagination);
}

function openPopup(){
    const popup = document.createElement('div');
    const popupOverlay = document.createElement('div');
    const titleBox = document.createElement('div')
    const contentBox = document.createElement('div')
    const buttonBox = document.createElement('div')
    const submit = document.createElement('button')
    const cancel = document.createElement('button')
    
    popup.classList.add('popup');
    popupOverlay.classList.add('popup-overlay');
    
    submit.id = 'submit';
    cancel.id = 'cancel';
    titleBox.className ='title-box';
    buttonBox.className ='button-box';
    contentBox.className ='content-box';

    titleBox.innerHTML = `
        <label for="title-input" name="title">Title</label>
        <input type="text" name ="title" id="title-input">
    `
    contentBox.innerHTML = `
        <label for="content-input" name="content">Content</label>
        <input type="text" name ="content" id="content-input">
    `

    submit.textContent = 'Submit';
    cancel.textContent = 'Cancel';

    // popupOverlay.addEventListener('click', (e) => {
    //     if(e.target === popupOverlay){
    //         closePopup();
    //     }
    // })

    cancel.onclick = () => closePopup();

    buttonBox.appendChild(cancel);
    buttonBox.appendChild(submit);
    
    popup.appendChild(titleBox);
    popup.appendChild(contentBox);
    popup.appendChild(buttonBox);

    popupOverlay.appendChild(popup)
    document.body.appendChild(popupOverlay);
    document.body.style.overflow = 'hidden';
    
    function closePopup(){
        document.body.removeChild(popupOverlay);
        document.body.style.overflow = ''
    }
}
function showErrorToast(message) {
    const toast = document.getElementById('error-toast');
    toast.textContent = message;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
    fetchTodos();
    document.getElementById('todo-list').addEventListener('change', async function(e){
        if(e.target.type === 'checkbox'){
            const todoItem = e.target.closest('.todo-item')
            const todoId = todoItem?.id
            const todoCheckbox = e.target;

            try{
                const response = await fetch(`/api/todos/${todoId}/toggle`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok){
                    const data = await response.json();
                    todoCheckbox.checked = data.status;
                    
                    todoItem.classList.add('success-toggle');
                    setTimeout(() => {
                        todoItem.classList.remove('success-toggle')
                    },1400)
                }else{
                     // Try to extract error message from Flask response
        let errorMsg = 'Failed to toggle item.';
        try {
            const errJson = await response.json();
            errorMsg = errJson.error || JSON.stringify(errJson);
        } catch {
            const fallback = await response.text();
            errorMsg = fallback;
        }
         showErrorToast(errorMsg); // Better UX
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