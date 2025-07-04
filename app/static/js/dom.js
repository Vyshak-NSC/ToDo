import { fetchTodos } from "./scripts.js";
import { createTodo, showErrorToast } from "./utils.js";
import { deleteTodoAPI } from "./api.js";

export const createTodoItem = (todo) => {
    const item = document.createElement('div');
    item.className = 'todo-item';
    item.id = todo.uid;
    
    // Todo header
    const header = document.createElement('div');
    header.className = 'todo-header';

    const timestmp = document.createElement('p');
    timestmp.className = 'todo-timestmp';
    timestmp.textContent = `${todo.date}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '\u274C';
    deleteBtn.onclick = async () => {
        try{
            await deleteTodoAPI(todo.uid);
            fetchTodos();
        }catch{
            showErrorToast("Failed to delete todo")
        }
    }
    
    header.appendChild(timestmp);
    header.appendChild(deleteBtn);
    
    // Todo title & text
    const todoBody = document.createElement('div');
    todoBody.className = 'todo-body';
    
    const title = document.createElement('p');
    title.className = 'todo-title';
    title.textContent = `${todo.title}`;

    const content = document.createElement('p');
    content.className = 'todo-content';
    content.textContent = `${todo.content}`

    // todo status
    const status = document.createElement('div');
    status.className = 'todo-status';
    status.innerHTML =`
        <label class="circle-checkbox">
        <input type="checkbox" id="todo-${todo.uid}" ${todo.status ? "checked" : ""}>
        <span></span>
        </label>
    `

    const line = document.createElement('hr')
    const textBody = document.createElement('div');
    textBody.className = 'text-body';

    item.appendChild(header);
    item.appendChild(line)
    
    textBody.appendChild(title);
    textBody.appendChild(content);
    
    todoBody.appendChild(textBody);
    todoBody.appendChild(status);

    item.appendChild(todoBody);
    
    // ====layout====
    // item
    // | header                     |
    // |   |-timestmp               |
    // |   |-delete-btn             |
    // | line-----------------------|
    // | todo body                  |
    // |     |text body   |         |
    // |     |   title    | status  |
    // |     |   content  |         |
    

    item.addEventListener('click', function(e) {
        if (
            e.target.classList.contains('delete-btn') ||
            e.target.closest('.circle-checkbox')
        ) return;
        
        // Expand only if text overflows its container
        if (content.scrollHeight > textBody.clientHeight || title.scrollWidth > title.clientWidth) {
            item.classList.toggle('expanded-todo');
            console.log('expanded');
        }else{
            item.classList.remove('expanded-todo')
        }
    });
    return item;
}

export const openPopup = () => {
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
        <input type="text" name="title" id="title-input" maxlength="50">
        <span id="title-word-count">0/50</span>
    `;
    contentBox.innerHTML = `
        <label for="content-input" name="content">Content</label>
        <input type="text" name="content" id="content-input" maxlength="200">
        <span id="content-word-count">0/200</span>
    `;

    const titleInput = titleBox.querySelector('#title-input');
    const titleCount = titleBox.querySelector('#title-word-count');
    const contentInput = contentBox.querySelector('#content-input');
    const contentCount = contentBox.querySelector('#content-word-count');

    titleInput.addEventListener('input', () => {
        titleCount.textContent = `${titleInput.value.length}/50`
    })

    contentInput.addEventListener('input', () => {
        contentCount.textContent = `${contentInput.value.length}/200`
    })
    
    

    submit.textContent = 'Submit';
    cancel.textContent = 'Cancel';

    submit.onclick = async () => {
        // call createTodo which has createTodoAPI
        // on success call fetchTodo to refresh and close popup
        // on error show error toast
        await createTodo({
            onSuccess: () => {
                fetchTodos();
                closePopup();
            },
            onError: showErrorToast
        })
    }

    popupOverlay.addEventListener('click', (e) => {
        if(e.target === popupOverlay){
            closePopup();
        }
    })

    cancel.onclick = () => closePopup();

    buttonBox.appendChild(cancel);
    buttonBox.appendChild(submit);
    
    popup.appendChild(titleBox);
    popup.appendChild(contentBox);
    popup.appendChild(buttonBox);

    popupOverlay.appendChild(popup)
    document.body.appendChild(popupOverlay);
    document.body.style.overflow = 'hidden';
}

function closePopup(){
    const overlay = document.querySelector('.popup-overlay')
    if(overlay){
        document.body.removeChild(overlay);
        document.body.style.overflow = ''
    }
}