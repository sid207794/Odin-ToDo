import arrowUp from "./images/arrow-up.svg";
import bell from "./images/bell-outline.svg";
import star from "./images/star-outline.svg";

const myListDialog = (function () {
    const dialog = document.querySelector(".myList dialog");
    dialog.style.backgroundColor = "#161616";
    dialog.style.border = "solid 1px #505050";
    dialog.style.borderRadius = "10px";
    dialog.style.height = "28vh";
    dialog.style.width = "40vw";
    dialog.style.filter = "brightness(100%)";
  
    const openBtn = document.querySelector(".myList .add");
    const closeBtn = document.querySelector(".myList dialog .close");
    const submitBtn = document.querySelector(".myList dialog .submit");
    const listName = document.querySelector(".listName");
    const myList = document.querySelector(".myList");
    const content = document.querySelector("#content");
  
    openBtn.addEventListener("click", () => {
        document.querySelector(".myList dialog input").value = "";
        dialog.showModal();
    });
  
    closeBtn.addEventListener("click", () => {
        dialog.close();
    });
    
    submitBtn.addEventListener("click", () => {
        const userInput = document.querySelector(".myList dialog input").value;
        if (userInput !== "") {
            const uniqueclass = crypto.randomUUID();
            listName.textContent = userInput;
            const myListItem = document.createElement("div");
            myListItem.classList.add(`${uniqueclass}`);
            myListItem.setAttribute("id", "item");
            myListItem.textContent = userInput;
            myList.appendChild(myListItem);
      
            content.replaceChildren();
      
            contentCreate(uniqueclass);
            myListItems(uniqueclass, userInput);
            dialog.close();
        }
    });
})();
  
function myListItems(UID, input) {
    const content = document.querySelector("#content");
    const listName = document.querySelector(".listName");
    const item = document.querySelector(`.${CSS.escape(UID)}`);
    item.addEventListener("click", () => {
        content.replaceChildren();
        listName.textContent = input;
        contentCreate(UID);
    });
}

function contentCreate(UID) {
    const content = document.querySelector("#content");

    const taskList = (function () {
        const contentItem = document.createElement("div");
        const today = document.createElement("div");
        const tomorrow = document.createElement("div");
        const upcoming = document.createElement("div");
        const h3Today = document.createElement("h3");
        const h3Tomorrow = document.createElement("h3");
        const h3Upcoming = document.createElement("h3");
        const contentItemFooter = document.createElement("footer");
        const contentItemFooterSubmit = document.createElement("button");
        const buttonsFooter = document.createElement("div");
        const reminderButton = document.createElement("button");
        const priorityButton = document.createElement("button");
        const imgArrow = document.createElement("img");
        const imgBell = document.createElement("img");
        const imgStar = document.createElement("img");
        imgArrow.src = arrowUp;
        imgBell.src = bell;
        imgStar.src = star;

        contentItem.classList.add(`${UID}`);
        contentItem.classList.add(`list`);
        today.classList.add("today");
        h3Today.textContent = "Today";
        tomorrow.classList.add("tomorrow");
        h3Tomorrow.textContent = "Tomorrow";
        upcoming.classList.add("upcoming");
        h3Upcoming.textContent = "Upcoming";
        contentItemFooter.classList.add("footerInputBox");
        contentItemFooter.innerHTML = `<input type="text" id="footerInput" placeholder="+ Add task">`;
        contentItemFooterSubmit.classList.add("addTask");
        today.style.padding = "0 25px";
        tomorrow.style.padding = "0 25px";
        upcoming.style.padding = "0 25px";
        buttonsFooter.classList.add("footerButtons");
        reminderButton.classList.add("reminder");
        priorityButton.classList.add("priority");

        content.appendChild(contentItem)
        contentItem.appendChild(today);
        contentItem.appendChild(tomorrow);
        contentItem.appendChild(upcoming);
        today.appendChild(h3Today);
        tomorrow.appendChild(h3Tomorrow);
        upcoming.appendChild(h3Upcoming);
        contentItem.appendChild(contentItemFooter);

        const input = document.querySelector(".footerInputBox #footerInput");
        
        contentItemFooter.appendChild(contentItemFooterSubmit);
        contentItemFooter.insertBefore(buttonsFooter, input);
        contentItemFooterSubmit.appendChild(imgArrow);
        buttonsFooter.appendChild(reminderButton);
        buttonsFooter.appendChild(priorityButton);
        reminderButton.appendChild(imgBell);
        priorityButton.appendChild(imgStar);

        addTask(UID);
    })();
    
    function addTask(UID) {
        const contentItem = document.querySelector(`#content .${CSS.escape(UID)}`)
        const submit = document.querySelector(`.${CSS.escape(UID)} .addTask`);
        const footer = document.querySelector(`.${CSS.escape(UID)} .footerInputBox`);
        const input = document.querySelector(`.${CSS.escape(UID)} #footerInput`);
    
        console.log(`${contentItem}, ${submit}, ${footer}, ${input}`);
    
        submit.addEventListener("click", () => {
            if (input.value !== "") {
                const newTask = document.createElement("div");
                const label = document.createElement("label");
                const checkbox = document.createElement("input");
                const taskUID = crypto.randomUUID();

                label.setAttribute("for", `task-${taskUID}`);
                checkbox.setAttribute("type", "checkbox");
                checkbox.setAttribute("id", `task-${taskUID}`);
                newTask.classList.add(`task-${taskUID}`);
                newTask.style.padding = "0 25px";
                const labelText = document.createTextNode(input.value);
    
                contentItem.insertBefore(newTask, footer);
                newTask.appendChild(label);
                label.appendChild(checkbox);
                label.insertBefore(labelText, null);

                input.value = "";
                // Add array
            }
        });
    }

    function reminder() {
        //
    }

    (function () {
        const contentItemDetail = document.createElement("div");
        const header = document.createElement("div");
        const title = document.createElement("div");
        const buttons = document.createElement("div");
        const notes = document.createElement("div");
        const attachments = document.createElement("div");

        contentItemDetail.classList.add(`${UID}-detail`);
        contentItemDetail.classList.add(`detail`);
        header.classList.add("header");
        title.classList.add("title");
        buttons.classList.add("buttons");
        notes.classList.add("notes");
        attachments.classList.add("attachments");

        const headDelete = document.createElement("button");
        headDelete.classList.add(`${UID}-deleteButton`)

        content.appendChild(contentItemDetail);
        contentItemDetail.appendChild(header);
        contentItemDetail.appendChild(title);
        contentItemDetail.appendChild(buttons);
        contentItemDetail.appendChild(notes);
        contentItemDetail.appendChild(attachments);
    })();
}