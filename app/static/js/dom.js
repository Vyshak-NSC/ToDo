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
    const footer = document.createElement('div');
    footer.className = 'todo-footer';

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
    
    footer.appendChild(timestmp);
    header.appendChild(deleteBtn);

    // Todo title & content
    const title = document.createElement('p');
    title.className = 'todo-title';
    title.textContent = `${todo.title}`;

    const content = document.createElement('div');
    content.className = 'todo-content';
    
    const text = document.createElement('p');
    text.className = 'todo-text';
    text.textContent = `${todo.content}`

    // todo status
    const status = document.createElement('div');
    status.className = 'todo-status';
    status.innerHTML =`
        <label class="circle-checkbox">
        <input type="checkbox" id="todo-${todo.uid}" ${todo.status ? "checked" : ""}>
        <span></span>
        </label>
    `
    content.appendChild(header);
    content.appendChild(title);
    content.appendChild(text);
    content.appendChild(footer);
    
    item.appendChild(content);
    item.appendChild(status);

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
        <input type="text" name ="title" id="title-input">
    `
    contentBox.innerHTML = `
        <label for="content-input" name="content">Content</label>
        <input type="text" name ="content" id="content-input">
    `

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