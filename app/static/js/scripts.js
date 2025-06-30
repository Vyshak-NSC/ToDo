async function fetchTodos(){
    const container = document.getElementById('todo-list')
    try{
        const response = await fetch('/api/todos');
        const todos = await response.json();
    
        if(todos.length === 0){
            container.innerHTML = `<p>No todos found!</p>`
            return;
        }
        container.innerHTML = ''

        todos.forEach(todo => {
            const item = document.createElement('div');
            item.classList.add('todo-item');
            item.id = todo.uid;

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
            content.appendChild(title);
            content.appendChild(text);
            
            item.appendChild(content);
            item.appendChild(status);

            container.appendChild(item)
        });

    }catch{
        container.innerHTML = 'Failed to load todos'
    }
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
                    todoItem.classList.add('success-toggle');
                    setTimeout(() => {
                    todoItem.classList.remove('success-toggle')
                },1400)
                }else{
                    throw new Error('error')
                }
                const data = await response.json();
                todoCheckbox.checked = data.status;
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