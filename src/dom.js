import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/dark.css";
import arrowUp from "./images/arrow-up.svg";
import bell from "./images/bell-outline.svg";
import star from "./images/star-outline.svg";
import cross from "./images/window-close.svg";

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

    dialog.addEventListener("click", (e) => {
        if (e.target === dialog) {
            dialog.close();
        }
    });
    
    submitBtn.addEventListener("click", () => {
        const userInput = document.querySelector(".myList dialog input").value;
        const burgerDialogCover = document.querySelector(".burgerDialogCover");

        if (userInput !== "") {
            const uniqueclass = crypto.randomUUID();
            listName.textContent = userInput;
            const myListItem = document.createElement("div");
            myListItem.classList.add(`${uniqueclass}`);
            myListItem.classList.add("item");
            myListItem.textContent = userInput;
            myList.appendChild(myListItem);
      
            content.replaceChildren();

            burgerDialogCover.replaceChildren();
            const listDelete = document.createElement("button");
            const taskDeleteSelect = document.createElement("button");
            listDelete.classList.add("listDelete");
            listDelete.classList.add(`${uniqueclass}`);
            taskDeleteSelect.classList.add("taskDeleteSelect");
            taskDeleteSelect.classList.add(`${uniqueclass}`);
            listDelete.textContent = "Delete List";
            taskDeleteSelect.textContent = "Delete Task";
            burgerDialogCover.appendChild(listDelete);
            burgerDialogCover.appendChild(taskDeleteSelect);

            contentCreate(uniqueclass);
            deleteAction(uniqueclass);
            myListItems(uniqueclass, userInput);
            dialog.close();
        }
    });
})();

let datePickerInstance;

function myListItems(UID, input) {
    const content = document.querySelector("#content");
    const listName = document.querySelector(".listName");
    const item = document.querySelector(`.myList .${CSS.escape(UID)}`);
    item.addEventListener("click", () => {
        const burgerDialogCover = document.querySelector(".burgerDialogCover");
        if (datePickerInstance) {
            datePickerInstance.destroy();
            datePickerInstance = null;
        }
        content.replaceChildren();

        burgerDialogCover.replaceChildren();
        const listDelete = document.createElement("button");
        const taskDeleteSelect = document.createElement("button");
        listDelete.classList.add("listDelete");
        listDelete.classList.add(`${UID}`);
        taskDeleteSelect.classList.add("taskDeleteSelect");
        taskDeleteSelect.classList.add(`${UID}`);
        listDelete.textContent = "Delete List";
        taskDeleteSelect.textContent = "Delete Task";
        burgerDialogCover.appendChild(listDelete);
        burgerDialogCover.appendChild(taskDeleteSelect);

        listName.textContent = input;
        contentCreate(UID);
        deleteAction(UID);
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
        timeDialog();
    })();
    
    function addTask(UID) {
        const contentItem = document.querySelector(`#content .${CSS.escape(UID)}`)
        const submit = document.querySelector(`#content .${CSS.escape(UID)} .addTask`);
        const footer = document.querySelector(`#content .${CSS.escape(UID)} .footerInputBox`);
        const input = document.querySelector(`#content .${CSS.escape(UID)} #footerInput`);
    
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

    function timeDialog() {
        const bellBtn = document.querySelector(".reminder");
        const star = document.querySelector(".priority");
        const footerButtons = document.querySelector(".footerButtons");

        const dialogReminder = document.createElement("dialog");
        const div = document.createElement("div");
        const dialogReminderClose = document.createElement("button");
        const timeInput = document.createElement("input");
        const submitTime = document.createElement("button");
        const imgCross = document.createElement("img");
        imgCross.src = cross;

        dialogReminder.classList.add("bellDialog");
        div.classList.add("bellDialogCover");
        dialogReminderClose.classList.add("close");
        dialogReminder.style.backgroundColor = "#161616";
        dialogReminder.style.border = "solid 1px #50505080";
        dialogReminder.style.borderRadius = "10px";
        dialogReminder.style.height = "60vh";
        dialogReminder.style.width = "21vw";
        dialogReminder.style.filter = "brightness(100%)";
        dialogReminder.style.minWidth = "320px";
        timeInput.setAttribute("id", "dateTimePicker");
        timeInput.setAttribute("type", "text");
        timeInput.setAttribute("placeholder", "Select Date");
        timeInput.style.display = "none";
        submitTime.classList.add("submitTime");
        submitTime.textContent = "Set";
        
        footerButtons.appendChild(dialogReminder);
        dialogReminder.appendChild(div);
        div.appendChild(dialogReminderClose);
        dialogReminderClose.appendChild(imgCross);
        div.appendChild(timeInput);
        div.appendChild(submitTime);

        datePickerInstance = null;
        const todayDate = new Date();

        bellBtn.addEventListener("click", () => {
            dialogReminder.showModal();

            if (!datePickerInstance) {
                datePickerInstance = flatpickr(timeInput, {
                    enableTime: true,
                    inline: true,
                    dateFormat: "d-m-Y H:i",
                    appendTo: dialogReminder,
                    defaultDate: new Date(),
                    minDate: todayDate,
                });
            }
        });

        dialogReminderClose.addEventListener("click", () => {
            bellBtn.replaceChildren();
            const imgBell = document.createElement("img");
            imgBell.src = bell;
            bellBtn.appendChild(imgBell);
            timeInput.value = "";
            if (datePickerInstance) {
                datePickerInstance.destroy();
                datePickerInstance = null;
            }
            dialogReminder.close();
        });

        submitTime.addEventListener("click", () => {
            const dateInput = timeInput.value;
            const [date, time] = dateInput.split(" ");
            const [dateDay, dateMonth, dateYear] = date.split("-"); // Remove comment if used later
            const yyyy = todayDate.getFullYear();
            const mm = String(todayDate.getMonth()+1).padStart(2, "0");
            const dd = String(todayDate.getDate()).padStart(2, "0");
            const today = `${dd}-${mm}-${yyyy}`;

            if (date === today) {
                bellBtn.replaceChildren();
                bellBtn.textContent = time;
            } else if (date === `${parseInt(dd)+1}-${mm}-${yyyy}`) {
                bellBtn.replaceChildren();
                const weekDay = new Date(parseInt(yyyy), parseInt(mm)-1, parseInt(dd)+1);
                const weekDayName = weekDay.toLocaleDateString("en-US", { weekday: "short"});
                bellBtn.textContent = `${weekDayName} ${time}`;
            } else {
                bellBtn.replaceChildren();
                bellBtn.textContent = `${date}`;
            }
            dialogReminder.close()
        });

        dialogReminder.addEventListener("click", (e) => {
            if (e.target === dialogReminder) {
                dialogReminder.close();
            }
        });
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

const burgerDialog = (function () {
    const burger = document.querySelector("#left .burger");
    const burgerImg = document.querySelector("#left .burger img");
    const dialog = document.querySelector("#left .burgerDialog");
    
    dialog.style.backgroundColor = "#2a2d33";
    dialog.style.border = "none";
    dialog.style.borderRadius = "10px";
    dialog.style.height = "12vh";
    dialog.style.width = "10vw";
    dialog.style.minWidth = "160px";
    dialog.style.filter = "brightness(100%)";
    dialog.style.position = "absolute";
    dialog.style.top = "44px";
    dialog.style.display = "none";

    burger.addEventListener("click", (event) => {
        event.stopPropagation();
        if (dialog.style.display === "none") {
            dialog.style.display = "flex";
            dialog.style.flexDirection = "column";
            dialog.style.left = `${burger.offsetLeft-46}px`;
            burger.style.backgroundColor = "#161616";
            burgerImg.style.filter = "invert(46%) sepia(96%) saturate(1918%) hue-rotate(185deg) brightness(101%) contrast(102%)";
        } else {
            dialog.style.display = "none";
            burger.style.backgroundColor = "transparent";
            burgerImg.style.filter = "invert(70%)";
        }
    });

    document.addEventListener("click", () => {
        dialog.style.display = "none";
        burger.style.backgroundColor = "transparent";
        burgerImg.style.filter = "invert(70%)";
    });

    dialog.addEventListener("click", (e) => {
        e.stopPropagation();
    });
})();

function deleteAction(UID) {
    const deleteListBtn = document.querySelector(`.listDelete.${CSS.escape(UID)}`);
    const listToDelete = document.querySelector(`.myList .${CSS.escape(UID)}`);
    const burger = document.querySelector("#left .burger");
    const burgerImg = document.querySelector("#left .burger img");
    const dialog = document.querySelector("#left .burgerDialog");

    deleteListBtn.addEventListener("click", () => {
        const content = document.querySelector("#content");
        const myList = document.querySelector(".myList");

        if (datePickerInstance) {
            datePickerInstance.destroy();
            datePickerInstance = null;
        }
        console.log(content.children);
        content.replaceChildren();
        console.log("content removed", content.children);
        myList.removeChild(listToDelete);
        console.log("list name removed");

        const item = document.querySelector(".myList .item");
        const listName = document.querySelector(".listName");

        if (item) {
            const itemUID = item.classList[0];
            item.click();
        } else {
            listName.textContent = "";
        }
        
        dialog.style.display = "none";
        burger.style.backgroundColor = "transparent";
        burgerImg.style.filter = "invert(70%)";
    });
}