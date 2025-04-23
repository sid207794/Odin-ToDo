import arrowUp from "./images/arrow-up.svg";

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
        const contentItemFooter = document.createElement("footer");
        const contentItemFooterSubmit = document.createElement("button");
        const img = document.createElement("img");
        img.src = arrowUp;

        contentItem.classList.add(`${UID}`);
        contentItemFooter.classList.add("footerInputBox");
        contentItemFooter.innerHTML = `<input type="text" id="footerInput" placeholder="+ Add task">`;
        contentItemFooterSubmit.classList.add("addTask");

        content.appendChild(contentItem)
        contentItem.appendChild(contentItemFooter);
        contentItemFooter.appendChild(contentItemFooterSubmit);
        contentItemFooterSubmit.appendChild(img);

        contentCreate.addTask(UID);
    })();

    function taskDetail(UID) {
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
    }
}
    
contentCreate.addTask = function (UID) {
    const contentItem = document.querySelector(`.${CSS.escape(UID)}`)
    const submit = document.querySelector(`.${CSS.escape(UID)} .addTask`);
    const footer = document.querySelector(`.${CSS.escape(UID)} .footerInputBox`);
    const input = document.querySelector(`.${CSS.escape(UID)} #footerInput`);

    console.log(`${contentItem}, ${submit}, ${footer}, ${input}`);

    submit.addEventListener("click", () => {
        if (input.value !== "") {
            const newTask = document.createElement("div");
            const taskUID = crypto.randomUUID();
            newTask.classList.add(`task-${taskUID}`);
            newTask.textContent = input.value;

            contentItem.insertBefore(newTask, footer);
        }
    });
};