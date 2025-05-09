import { MyListClass, Today, Tomorrow, Upcoming, listArray } from "./logic.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/dark.css";
import arrowUp from "./images/arrow-up.svg";
import bell from "./images/bell-outline.svg";
import star from "./images/star-outline.svg";
import starfill from "./images/star-filled.svg";
import cross from "./images/window-close.svg";
import trash from "./images/trash-can-outline.svg";
import tick from "./images/check-circle-outline.svg";
import bell2 from "./images/bell2.svg";
import move from "./images/file-document-arrow-right.svg";
import star2 from "./images/star-plus.svg";
import checkCircle from "./images/check-circle.svg";
import fileJPG from "./images/file-jpg-box.svg";
import filePDF from "./images/file-pdf-box.svg";
import filePNG from "./images/file-png-box.svg";
import fileWord from "./images/file-word.svg";

const myListDialog = (function () {
    const dialog = document.querySelector(".myList dialog");
  
    const openBtn = document.querySelector(".myList .add");
    const closeBtn = document.querySelector(".myList dialog .close");
    const submitBtn = document.querySelector(".myList dialog .submit");
    const listName = document.querySelector(".listName #listname");
    const mirror = document.querySelector(".listName .mirrorName");
    const myList = document.querySelector(".myList");
    const content = document.querySelector("#content");
    const burger = document.querySelector("#left .burger");
  
    openBtn.addEventListener("click", () => {
        document.querySelector(".myList dialog input").value = "";
        dialogPropertiesChildren.dialogOpen(dialog);
    });
  
    closeBtn.addEventListener("click", () => {
        dialogPropertiesChildren.dialogClose(dialog);
    });

    dialog.addEventListener("click", (e) => {
        if (e.target === dialog) {
            dialogPropertiesChildren.dialogClose(dialog);
        }
    });
    
    submitBtn.addEventListener("click", () => {
        const userInput = document.querySelector(".myList dialog input").value;
        const items = document.querySelectorAll(".myList .item.highlighted");

        if (userInput !== "") {
            const uniqueclass = crypto.randomUUID();
            listName.value = userInput;
            mirror.textContent = userInput;
            listNameEventListener(userInput);
            const myListItem = document.createElement("div");
            myListItem.classList.add(`${uniqueclass}`);
            myListItem.classList.add("item");
            items.forEach(element => {
                element.classList.remove("highlighted");
            });
            myListItem.classList.add("highlighted");
            myListItem.textContent = userInput;
            myList.appendChild(myListItem);
            myListItem.scrollIntoView({
                behavior: "smooth",
                block: "end"
            });
      
            content.replaceChildren();

            burger.disabled = false;
            burger.classList.remove("disabled");
            createBurgerDialogCover(uniqueclass);

            const newList = new MyListClass(uniqueclass, userInput);
            listArray.push(newList);
            localStorage.setItem("todoData", JSON.stringify(listArray));

            contentCreate(uniqueclass);
            deleteAction(uniqueclass);
            myListItems(uniqueclass, userInput);

            const viewText = document.querySelector("#left .view span");
            viewText.textContent = "View";
            
            dialogPropertiesChildren.dialogClose(dialog);
        }
    });

    function listNameEventListener() {
        listName.style.display = "block";
        listName.style.width = (mirror.offsetWidth / window.innerWidth)*100 + "vw";
        listName.addEventListener("input", () => {
            mirror.textContent = listName.value;
            listName.style.width = (mirror.offsetWidth / window.innerWidth)*100 + "vw";
            if (listName.value.length === 0) {
                listName.style.width = "8.14vw"; // 125px
            }

            const list = document.querySelector("#content .list");
            const detail = document.querySelector("#content .detail");
            if (list) {
                const listUID = list.classList[0];
                const item = document.querySelector(`#sidebar .myList .${CSS.escape(listUID)}`);
                item.textContent = listName.value;
                const targetClass = listArray.find(item => item.ListId === listUID);
                targetClass.ListName = listName.value;
                localStorage.setItem("todoData", JSON.stringify(listArray));
            }

            if (detail) {
                const detailUID = detail.classList[0];
                const item = document.querySelector(`#content .${CSS.escape(detailUID)}.detail .buttons .listName`);
                const textNode = Array.from(item.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                textNode.textContent = listName.value;
            }
        });
    }

    return { listNameEventListener };
})();

let datePickerInstance;

export function myListItems(UID, input) {
    const content = document.querySelector("#content");
    const listName = document.querySelector(".listName #listname");
    const item = document.querySelector(`.myList .${CSS.escape(UID)}`);
    const mirror = document.querySelector(".listName .mirrorName");
    item.addEventListener("click", () => {
        const contentList = document.querySelector(`#content .${CSS.escape(UID)}.list`);
        const items = document.querySelectorAll(".myList .item.highlighted");
        if(!content.contains(contentList)) {
            if (datePickerInstance) {
                datePickerInstance.destroy();
                datePickerInstance = null;
            }
            content.replaceChildren();
    
            createBurgerDialogCover(UID);
    
            listName.value = item.textContent;
            mirror.textContent = item.textContent;
            listName.style.width = (mirror.offsetWidth / window.innerWidth)*100 + "vw";
            if (listName.value.length === 0) {
                listName.style.width = "8.14vw"; // 125px
            }
            contentCreate(UID);
            deleteAction(UID);

            items.forEach(element => {
                element.classList.remove("highlighted");
            });
            item.classList.add("highlighted");

            const viewText = document.querySelector("#left .view span");
            viewText.textContent = "View";
        }
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
        const imgStarFill = document.createElement("img");
        imgArrow.src = arrowUp;
        imgBell.src = bell;
        imgStar.src = star;
        imgStarFill.src = starfill;

        contentItem.classList.add(`${UID}`);
        contentItem.classList.add(`list`);
        today.classList.add("today");
        h3Today.textContent = "Today";
        tomorrow.classList.add("tomorrow");
        h3Tomorrow.textContent = "Tomorrow";
        upcoming.classList.add("upcoming");
        h3Upcoming.textContent = "Upcoming";
        contentItemFooter.classList.add("footerInputBox");
        contentItemFooter.innerHTML = `<input type="text" id="footerInput" maxlength="37" placeholder="+ Add task" autocomplete="off">`;
        contentItemFooterSubmit.classList.add("addTask");
        buttonsFooter.classList.add("footerButtons");
        reminderButton.classList.add("reminder");
        priorityButton.classList.add("priority");

        content.appendChild(contentItem);
        requestAnimationFrame(() => {
            contentItem.classList.add("fadeIn");
        });
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

        priorityButton.addEventListener("click", () => {
            priorityButton.classList.toggle("on");
            if (priorityButton.classList[1] === "on") {
                priorityButton.replaceChildren();
                priorityButton.appendChild(imgStarFill);
            } else {
                priorityButton.replaceChildren();
                priorityButton.appendChild(imgStar);
            }
        });

        timeDialog();
        addTask(UID);
        taskHideReveal();
    })();
    
    function addTask(UID) {
        const submit = document.querySelector(`#content .${CSS.escape(UID)} .addTask`);
        const footer = document.querySelector(`#content .${CSS.escape(UID)} .footerInputBox`);
        const input = document.querySelector(`#content .${CSS.escape(UID)} #footerInput`);
        const timeInput = document.querySelector(`#content .${CSS.escape(UID)} #dateTimePicker`);
        const today = document.querySelector(`#content .${CSS.escape(UID)} .today`);
        const tomorrow = document.querySelector(`#content .${CSS.escape(UID)} .tomorrow`);
        const upcoming = document.querySelector(`#content .${CSS.escape(UID)} .upcoming`);
        const viewText = document.querySelector("#left .view span");
        const todayDate = new Date();
        let priorityMode;
        const tickImg = document.createElement("img");
        const checkImg = document.createElement("img");
        const imgStar = document.createElement("img");
        tickImg.src = tick;
        checkImg.src = checkCircle;
        imgStar.src = star;
        
        const targetClass = listArray.find(item => item.ListId === UID);

        populateExisitingList();
    
        submit.addEventListener("click", () => {
            const dateInput = timeInput.value;
            const [date, time] = dateInput.split(" ");
            const yyyy = todayDate.getFullYear();
            const mm = String(todayDate.getMonth()+1).padStart(2, "0");
            const dd = String(todayDate.getDate()).padStart(2, "0");
            const currentDate = `${dd}-${mm}-${yyyy}`;

            if (input.value !== "") {
                const newTask = document.createElement("div");
                const label = document.createElement("label");
                const checkbox = document.createElement("input");
                const taskUID = crypto.randomUUID();
                const list = document.querySelector(`#content .list`);
                const span = document.createElement("span");
                const priority = document.querySelector(".footerInputBox .priority");

                label.setAttribute("for", `${taskUID}`);
                checkbox.setAttribute("type", "checkbox");
                checkbox.setAttribute("id", `${taskUID}`);
                newTask.classList.add(`${taskUID}`);
                newTask.classList.add("task");
                
                if (timeInput.value === "" || date === currentDate) {
                    const labelText = document.createTextNode(`${input.value}`);
                    span.textContent = `${time || ""}`;
                    if (priority.classList[1] === "on") {
                        span.classList.add("yellow");
                        priorityMode = true;
                    } else {
                        priorityMode = false;
                    }
                    today.appendChild(newTask);
                    requestAnimationFrame(() => {
                        if (today.children.length === 2 || today.querySelector(".fadeIn")) {
                            newTask.classList.add("fadeIn");
                            newTask.style.display = "block";
                        } else if (!today.querySelector(".fadeIn")) {
                            newTask.style.display = "none";
                        }
                    });
                    newTask.appendChild(label);
                    label.appendChild(checkbox);
                    label.insertBefore(labelText, null);
                    label.appendChild(span);
                    newTask.addEventListener("click", (e) => {
                        const content = document.querySelector("#content");
                        const detail = document.querySelector("#content .detail");
                        const contentDetail = document.querySelector(`#content .${CSS.escape(taskUID)}.detail`);
                        if (!checkbox.contains(e.target)) {
                            e.stopPropagation();
                            e.preventDefault();
                            
                            const allTasks = document.querySelectorAll(`#content .list .task`);
                            allTasks.forEach(childTask => {
                                if (childTask.classList.contains("taskHighlight")) {
                                    childTask.classList.remove("taskHighlight");
                                }
                            });
                            newTask.classList.add("taskHighlight");
                            
                            if (!content.contains(contentDetail)) {
                                if (content.contains(detail)) {
                                    detail.classList.remove("fadeIn");
                                    detail.classList.add("fadeOut");
                                    setTimeout(() => {
                                        if (content.contains(detail)) {
                                            content.removeChild(detail);
                                            detailCard(taskUID);
                                            const inputTask = document.querySelector("#content .detail .title #taskName")
                                            inputTask.style.height = "auto";
                                            inputTask.style.height = (inputTask.scrollHeight / window.innerHeight)*100 + "vh";
                                        }
                                    }, 200);
                                } else {
                                    detailCard(taskUID);
                                    const inputTask = document.querySelector("#content .detail .title #taskName")
                                    inputTask.style.height = "auto";
                                    inputTask.style.height = (inputTask.scrollHeight / window.innerHeight)*100 + "vh";
                                }
                                viewText.textContent = "Hide";
                            }
                        }
                    });
                    checkbox.addEventListener("change", () => {
                        const completeImg = document.querySelector(`#content .${CSS.escape(taskUID)}.detail .header .complete`);
                        Object.entries(targetClass.today).forEach(([key, task]) => {
                            if (typeof task === "object" && task.id === taskUID && checkbox.checked) {
                                task.check = checkbox.checked;
                                label.style.textDecoration = "line-through";
                                label.style.color = "rgb(163, 162, 162)";
                                span.classList.add("grey");
                                if (completeImg) {
                                    completeImg.replaceChildren();
                                    completeImg.appendChild(checkImg);
                                    checkImg.style.filter = "invert(46%) sepia(96%) saturate(1918%) hue-rotate(185deg) brightness(101%) contrast(102%)";
                                }
                                localStorage.setItem("todoData", JSON.stringify(listArray));
                            } else if (typeof task === "object" && task.id === taskUID && !checkbox.checked) {
                                task.check = checkbox.checked;
                                label.style.textDecoration = "none";
                                label.style.color = "rgb(212, 212, 212)";
                                span.classList.remove("grey");

                                if (completeImg) {
                                    completeImg.replaceChildren();
                                    completeImg.appendChild(tickImg);
                                }
                                localStorage.setItem("todoData", JSON.stringify(listArray));
                            }
                        });
                    });
                    targetClass.today.addTask(taskUID, checkbox.checked, input.value, null, null, time || "", priorityMode);
                    localStorage.setItem("todoData", JSON.stringify(listArray));
                } else if (date === getNextDateFormatted(yyyy, mm, dd)) {
                    const weekDay = new Date(parseInt(yyyy), parseInt(mm)-1, parseInt(dd)+1);
                    const weekDayName = weekDay.toLocaleDateString("en-US", { weekday: "short"});
                    const labelText = document.createTextNode(`${input.value}`);
                    span.textContent = `${weekDayName} ${time}`;
                    if (priority.classList[1] === "on") {
                        span.classList.add("yellow");
                        priorityMode = true;
                    } else {
                        priorityMode = false;
                    }
                    tomorrow.appendChild(newTask);
                    requestAnimationFrame(() => {
                        if (tomorrow.children.length === 2 || tomorrow.querySelector(".fadeIn")) {
                            newTask.classList.add("fadeIn");
                            newTask.style.display = "block";
                        } else if (!tomorrow.querySelector(".fadeIn")) {
                            newTask.style.display = "none";
                        }
                    });
                    newTask.appendChild(label);
                    label.appendChild(checkbox);
                    label.insertBefore(labelText, null);
                    label.appendChild(span);
                    newTask.addEventListener("click", (e) => {
                        const content = document.querySelector("#content");
                        const detail = document.querySelector("#content .detail");
                        const contentDetail = document.querySelector(`#content .${CSS.escape(taskUID)}.detail`);
                        if (!checkbox.contains(e.target)) {
                            e.stopPropagation();
                            e.preventDefault();
                            
                            const allTasks = document.querySelectorAll(`#content .list .task`);
                            allTasks.forEach(childTask => {
                                if (childTask.classList.contains("taskHighlight")) {
                                    childTask.classList.remove("taskHighlight");
                                }
                            });
                            newTask.classList.add("taskHighlight");
                            
                            if (!content.contains(contentDetail)) {
                                if (content.contains(detail)) {
                                    detail.classList.remove("fadeIn");
                                    detail.classList.add("fadeOut");
                                    setTimeout(() => {
                                        if (content.contains(detail)) {
                                            content.removeChild(detail);
                                            detailCard(taskUID);
                                            const inputTask = document.querySelector("#content .detail .title #taskName")
                                            inputTask.style.height = "auto";
                                            inputTask.style.height = (inputTask.scrollHeight / window.innerHeight)*100 + "vh";
                                        }
                                    }, 200);
                                } else {
                                    detailCard(taskUID);
                                    const inputTask = document.querySelector("#content .detail .title #taskName")
                                    inputTask.style.height = "auto";
                                    inputTask.style.height = (inputTask.scrollHeight / window.innerHeight)*100 + "vh";
                                }
                                viewText.textContent = "Hide";
                            }
                        }
                    });
                    checkbox.addEventListener("change", () => {
                        const completeImg = document.querySelector(`#content .${CSS.escape(taskUID)}.detail .header .complete`);
                        Object.entries(targetClass.tomorrow).forEach(([key, task]) => {
                            if (typeof task === "object" && task.id === taskUID && checkbox.checked) {
                                task.check = checkbox.checked;
                                label.style.textDecoration = "line-through";
                                label.style.color = "rgb(163, 162, 162)";
                                span.classList.add("grey");
                                if (completeImg) {
                                    completeImg.replaceChildren();
                                    completeImg.appendChild(checkImg);
                                    checkImg.style.filter = "invert(46%) sepia(96%) saturate(1918%) hue-rotate(185deg) brightness(101%) contrast(102%)";
                                }
                                localStorage.setItem("todoData", JSON.stringify(listArray));
                            } else if (typeof task === "object" && task.id === taskUID && !checkbox.checked) {
                                task.check = checkbox.checked;
                                label.style.textDecoration = "none";
                                label.style.color = "rgb(212, 212, 212)";
                                span.classList.remove("grey");

                                if (completeImg) {
                                    completeImg.replaceChildren();
                                    completeImg.appendChild(tickImg);
                                }
                                localStorage.setItem("todoData", JSON.stringify(listArray));
                            }
                        });
                    });
                    targetClass.tomorrow.addTask(taskUID, checkbox.checked, input.value, null, weekDayName, time, priorityMode);
                    localStorage.setItem("todoData", JSON.stringify(listArray));
                } else {
                    const labelText = document.createTextNode(`${input.value}`);
                    span.textContent = `${date}`;
                    if (priority.classList[1] === "on") {
                        span.classList.add("yellow");
                        priorityMode = true;
                    } else {
                        priorityMode = false;
                    }
                    upcoming.appendChild(newTask);
                    requestAnimationFrame(() => {
                        if (upcoming.children.length === 2 || upcoming.querySelector(".fadeIn")) {
                            newTask.classList.add("fadeIn");
                            newTask.style.display = "block";
                        } else if (!upcoming.querySelector(".fadeIn")) {
                            newTask.style.display = "none";
                        }
                    });
                    newTask.appendChild(label);
                    label.appendChild(checkbox);
                    label.insertBefore(labelText, null);
                    label.appendChild(span);
                    newTask.addEventListener("click", (e) => {
                        const content = document.querySelector("#content");
                        const detail = document.querySelector("#content .detail");
                        const contentDetail = document.querySelector(`#content .${CSS.escape(taskUID)}.detail`);
                        if (!checkbox.contains(e.target)) {
                            e.stopPropagation();
                            e.preventDefault();
                            
                            const allTasks = document.querySelectorAll(`#content .list .task`);
                            allTasks.forEach(childTask => {
                                if (childTask.classList.contains("taskHighlight")) {
                                    childTask.classList.remove("taskHighlight");
                                }
                            });
                            newTask.classList.add("taskHighlight");
                            
                            if (!content.contains(contentDetail)) {
                                if (content.contains(detail)) {
                                    detail.classList.remove("fadeIn");
                                    detail.classList.add("fadeOut");
                                    setTimeout(() => {
                                        if (content.contains(detail)) {
                                            content.removeChild(detail);
                                            detailCard(taskUID);
                                            const inputTask = document.querySelector("#content .detail .title #taskName")
                                            inputTask.style.height = "auto";
                                            inputTask.style.height = (inputTask.scrollHeight / window.innerHeight)*100 + "vh";
                                        }
                                    }, 200);
                                } else {
                                    detailCard(taskUID);
                                    const inputTask = document.querySelector("#content .detail .title #taskName")
                                    inputTask.style.height = "auto";
                                    inputTask.style.height = (inputTask.scrollHeight / window.innerHeight)*100 + "vh";
                                }
                                viewText.textContent = "Hide";
                            }
                        }
                    });
                    checkbox.addEventListener("change", () => {
                        const completeImg = document.querySelector(`#content .${CSS.escape(taskUID)}.detail .header .complete`);
                        Object.entries(targetClass.upcoming).forEach(([key, task]) => {
                            if (typeof task === "object" && task.id === taskUID && checkbox.checked) {
                                task.check = checkbox.checked;
                                label.style.textDecoration = "line-through";
                                label.style.color = "rgb(163, 162, 162)";
                                span.classList.add("grey");
                                if (completeImg) {
                                    completeImg.replaceChildren();
                                    completeImg.appendChild(checkImg);
                                    checkImg.style.filter = "invert(46%) sepia(96%) saturate(1918%) hue-rotate(185deg) brightness(101%) contrast(102%)";
                                }
                                localStorage.setItem("todoData", JSON.stringify(listArray));
                            } else if (typeof task === "object" && task.id === taskUID && !checkbox.checked) {
                                task.check = checkbox.checked;
                                label.style.textDecoration = "none";
                                label.style.color = "rgb(212, 212, 212)";
                                span.classList.remove("grey");

                                if (completeImg) {
                                    completeImg.replaceChildren();
                                    completeImg.appendChild(tickImg);
                                }
                                localStorage.setItem("todoData", JSON.stringify(listArray));
                            }
                        });
                    });
                    targetClass.upcoming.addTask(taskUID, checkbox.checked, input.value, date, null, null, priorityMode);
                    localStorage.setItem("todoData", JSON.stringify(listArray));
                }

                if (list.scrollHeight > list.clientHeight) {
                    const h3 = document.querySelectorAll("#content .list h3");
                    h3.forEach(itemh3 => {
                        itemh3.style.backgroundColor = "transparent";
                        requestAnimationFrame(() => {
                            itemh3.style.backgroundColor = "#2a2d33";
                        });
                    });
                }

                input.value = "";

                if (priority.classList[1] === "on") {
                    priority.classList.remove("on");
                    priority.replaceChildren();
                    priority.appendChild(imgStar);
                }

                newTask.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        });

        function populateExisitingList() {
            if (Object.keys(targetClass.today).some(key => key.startsWith("task"))) {
                Object.keys(targetClass.today).forEach(key => {
                    if (key.startsWith("task")) {
                        const task = targetClass.today[key];
                        const newTask = document.createElement("div");
                        const label = document.createElement("label");
                        const checkbox = document.createElement("input");
                        const taskUID = task.id;
                        const span = document.createElement("span");
        
                        label.setAttribute("for", `${taskUID}`);
                        checkbox.setAttribute("type", "checkbox");
                        checkbox.setAttribute("id", `${taskUID}`);

                        if (task.check) {
                            checkbox.checked = true;
                            label.style.textDecoration = "line-through";
                            label.style.color = "rgb(163, 162, 162)";
                            span.classList.add("grey");
                        }

                        newTask.classList.add(`${taskUID}`);
                        newTask.classList.add("task");
                        
                        const labelText = document.createTextNode(`${task.text}`);
                        span.textContent = `${task.time}`;

                        if (task.priority) span.classList.add("yellow");

                        today.appendChild(newTask);
                        requestAnimationFrame(() => {
                            newTask.classList.add("fadeIn");
                        });
                        newTask.appendChild(label);
                        label.appendChild(checkbox);
                        label.insertBefore(labelText, null);
                        label.appendChild(span);
                        newTask.addEventListener("click", (e) => {
                            const content = document.querySelector("#content");
                            const detail = document.querySelector("#content .detail");
                            const contentDetail = document.querySelector(`#content .${CSS.escape(taskUID)}.detail`);
                            if (!checkbox.contains(e.target)) {
                                e.stopPropagation();
                                e.preventDefault();
                            
                                const allTasks = document.querySelectorAll(`#content .list .task`);
                                allTasks.forEach(childTask => {
                                    if (childTask.classList.contains("taskHighlight")) {
                                        childTask.classList.remove("taskHighlight");
                                    }
                                });
                                newTask.classList.add("taskHighlight");
                                
                                if (!content.contains(contentDetail)) {
                                    if (content.contains(detail)) {
                                        detail.classList.remove("fadeIn");
                                        detail.classList.add("fadeOut");
                                        setTimeout(() => {
                                            if (content.contains(detail)) {
                                                content.removeChild(detail);
                                                detailCard(taskUID);
                                                const inputTask = document.querySelector("#content .detail .title #taskName")
                                                inputTask.style.height = "auto";
                                                inputTask.style.height = (inputTask.scrollHeight / window.innerHeight)*100 + "vh";
                                            }
                                        }, 200);
                                    } else {
                                        detailCard(taskUID);
                                        const inputTask = document.querySelector("#content .detail .title #taskName")
                                        inputTask.style.height = "auto";
                                        inputTask.style.height = (inputTask.scrollHeight / window.innerHeight)*100 + "vh";
                                    }
                                    viewText.textContent = "Hide";
                                }
                            }
                        });
                        checkbox.addEventListener("change", () => {
                            const completeImg = document.querySelector(`#content .${CSS.escape(taskUID)}.detail .header .complete`);
                            Object.entries(targetClass.today).forEach(([key, task]) => {
                                if (typeof task === "object" && task.id === taskUID && checkbox.checked) {
                                    task.check = checkbox.checked;
                                    label.style.textDecoration = "line-through";
                                    label.style.color = "rgb(163, 162, 162)";
                                    span.classList.add("grey");
                                    if (completeImg) {
                                        completeImg.replaceChildren();
                                        completeImg.appendChild(checkImg);
                                        checkImg.style.filter = "invert(46%) sepia(96%) saturate(1918%) hue-rotate(185deg) brightness(101%) contrast(102%)";
                                    }
                                    localStorage.setItem("todoData", JSON.stringify(listArray));
                                } else if (typeof task === "object" && task.id === taskUID && !checkbox.checked) {
                                    task.check = checkbox.checked;
                                    label.style.textDecoration = "none";
                                    label.style.color = "rgb(212, 212, 212)";
                                    span.classList.remove("grey");

                                    if (completeImg) {
                                        completeImg.replaceChildren();
                                        completeImg.appendChild(tickImg);
                                    }
                                    localStorage.setItem("todoData", JSON.stringify(listArray));
                                }
                            });
                        });
                    }
                });
            }

            if (Object.keys(targetClass.tomorrow).some(key => key.startsWith("task"))) {
                Object.keys(targetClass.tomorrow).forEach(key => {
                    if (key.startsWith("task")) {
                        const task = targetClass.tomorrow[key];
                        const newTask = document.createElement("div");
                        const label = document.createElement("label");
                        const checkbox = document.createElement("input");
                        const taskUID = task.id;
                        const span = document.createElement("span");
        
                        label.setAttribute("for", `${taskUID}`);
                        checkbox.setAttribute("type", "checkbox");
                        checkbox.setAttribute("id", `${taskUID}`);

                        if (task.check) {
                            checkbox.checked = true;
                            label.style.textDecoration = "line-through";
                            label.style.color = "rgb(163, 162, 162)";
                            span.classList.add("grey");
                        }

                        newTask.classList.add(`${taskUID}`);
                        newTask.classList.add("task");
                        
                        const labelText = document.createTextNode(`${task.text}`);
                        span.textContent = `${task.weekDay} ${task.time}`;

                        if (task.priority) span.classList.add("yellow");
                        
                        tomorrow.appendChild(newTask);
                        requestAnimationFrame(() => {
                            newTask.classList.add("fadeIn");
                        });
                        newTask.appendChild(label);
                        label.appendChild(checkbox);
                        label.insertBefore(labelText, null);
                        label.appendChild(span);
                        newTask.addEventListener("click", (e) => {
                            const content = document.querySelector("#content");
                            const detail = document.querySelector("#content .detail");
                            const contentDetail = document.querySelector(`#content .${CSS.escape(taskUID)}.detail`);
                            if (!checkbox.contains(e.target)) {
                                e.stopPropagation();
                                e.preventDefault();
                            
                                const allTasks = document.querySelectorAll(`#content .list .task`);
                                allTasks.forEach(childTask => {
                                    if (childTask.classList.contains("taskHighlight")) {
                                        childTask.classList.remove("taskHighlight");
                                    }
                                });
                                newTask.classList.add("taskHighlight");
                                
                                if (!content.contains(contentDetail)) {
                                    if (content.contains(detail)) {
                                        detail.classList.remove("fadeIn");
                                        detail.classList.add("fadeOut");
                                        setTimeout(() => {
                                            if (content.contains(detail)) {
                                                content.removeChild(detail);
                                                detailCard(taskUID);
                                                const inputTask = document.querySelector("#content .detail .title #taskName")
                                                inputTask.style.height = "auto";
                                                inputTask.style.height = (inputTask.scrollHeight / window.innerHeight)*100 + "vh";
                                            }
                                        }, 200);
                                    } else {
                                        detailCard(taskUID);
                                        const inputTask = document.querySelector("#content .detail .title #taskName")
                                        inputTask.style.height = "auto";
                                        inputTask.style.height = (inputTask.scrollHeight / window.innerHeight)*100 + "vh";
                                    }
                                    viewText.textContent = "Hide";
                                }
                            }
                        });
                        checkbox.addEventListener("change", () => {
                            const completeImg = document.querySelector(`#content .${CSS.escape(taskUID)}.detail .header .complete`);
                            Object.entries(targetClass.tomorrow).forEach(([key, task]) => {
                                if (typeof task === "object" && task.id === taskUID && checkbox.checked) {
                                    task.check = checkbox.checked;
                                    label.style.textDecoration = "line-through";
                                    label.style.color = "rgb(163, 162, 162)";
                                    span.classList.add("grey");
                                    if (completeImg) {
                                        completeImg.replaceChildren();
                                        completeImg.appendChild(checkImg);
                                        checkImg.style.filter = "invert(46%) sepia(96%) saturate(1918%) hue-rotate(185deg) brightness(101%) contrast(102%)";
                                    }
                                    localStorage.setItem("todoData", JSON.stringify(listArray));
                                } else if (typeof task === "object" && task.id === taskUID && !checkbox.checked) {
                                    task.check = checkbox.checked;
                                    label.style.textDecoration = "none";
                                    label.style.color = "rgb(212, 212, 212)";
                                    span.classList.remove("grey");

                                    if (completeImg) {
                                        completeImg.replaceChildren();
                                        completeImg.appendChild(tickImg);
                                    }
                                    localStorage.setItem("todoData", JSON.stringify(listArray));
                                }
                            });
                        });
                    }
                });
            }
            
            if (Object.keys(targetClass.upcoming).some(key => key.startsWith("task"))) {
                Object.keys(targetClass.upcoming).forEach(key => {
                    if (key.startsWith("task")) {
                        const task = targetClass.upcoming[key];
                        const newTask = document.createElement("div");
                        const label = document.createElement("label");
                        const checkbox = document.createElement("input");
                        const taskUID = task.id;
                        const span = document.createElement("span");
        
                        label.setAttribute("for", `${taskUID}`);
                        checkbox.setAttribute("type", "checkbox");
                        checkbox.setAttribute("id", `${taskUID}`);

                        if (task.check) {
                            checkbox.checked = true;
                            label.style.textDecoration = "line-through";
                            label.style.color = "rgb(163, 162, 162)";
                            span.classList.add("grey");
                        }

                        newTask.classList.add(`${taskUID}`);
                        newTask.classList.add("task");
                        
                        const labelText = document.createTextNode(`${task.text}`);
                        span.textContent = `${task.date}`;

                        if (task.priority) span.classList.add("yellow");
                        
                        upcoming.appendChild(newTask);
                        requestAnimationFrame(() => {
                            newTask.classList.add("fadeIn");
                        });
                        newTask.appendChild(label);
                        label.appendChild(checkbox);
                        label.insertBefore(labelText, null);
                        label.appendChild(span);
                        newTask.addEventListener("click", (e) => {
                            const content = document.querySelector("#content");
                            const detail = document.querySelector("#content .detail");
                            const contentDetail = document.querySelector(`#content .${CSS.escape(taskUID)}.detail`);
                            if (!checkbox.contains(e.target)) {
                                e.stopPropagation();
                                e.preventDefault();
                            
                                const allTasks = document.querySelectorAll(`#content .list .task`);
                                allTasks.forEach(childTask => {
                                    if (childTask.classList.contains("taskHighlight")) {
                                        childTask.classList.remove("taskHighlight");
                                    }
                                });
                                newTask.classList.add("taskHighlight");
                                
                                if (!content.contains(contentDetail)) {
                                    if (content.contains(detail)) {
                                        detail.classList.remove("fadeIn");
                                        detail.classList.add("fadeOut");
                                        setTimeout(() => {
                                            if (content.contains(detail)) {
                                                content.removeChild(detail);
                                                detailCard(taskUID);
                                                const inputTask = document.querySelector("#content .detail .title #taskName")
                                                inputTask.style.height = "auto";
                                                inputTask.style.height = (inputTask.scrollHeight / window.innerHeight)*100 + "vh";
                                            }
                                        }, 200);
                                    } else {
                                        detailCard(taskUID);
                                        const inputTask = document.querySelector("#content .detail .title #taskName")
                                        inputTask.style.height = "auto";
                                        inputTask.style.height = (inputTask.scrollHeight / window.innerHeight)*100 + "vh";
                                    }
                                    viewText.textContent = "Hide";
                                }
                            }
                        });
                        checkbox.addEventListener("change", () => {
                            const completeImg = document.querySelector(`#content .${CSS.escape(taskUID)}.detail .header .complete`);
                            Object.entries(targetClass.upcoming).forEach(([key, task]) => {
                                if (typeof task === "object" && task.id === taskUID && checkbox.checked) {
                                    task.check = checkbox.checked;
                                    label.style.textDecoration = "line-through";
                                    label.style.color = "rgb(163, 162, 162)";
                                    span.classList.add("grey");
                                    if (completeImg) {
                                        completeImg.replaceChildren();
                                        completeImg.appendChild(checkImg);
                                        checkImg.style.filter = "invert(46%) sepia(96%) saturate(1918%) hue-rotate(185deg) brightness(101%) contrast(102%)";
                                    }
                                    localStorage.setItem("todoData", JSON.stringify(listArray));
                                } else if (typeof task === "object" && task.id === taskUID && !checkbox.checked) {
                                    task.check = checkbox.checked;
                                    label.style.textDecoration = "none";
                                    label.style.color = "rgb(212, 212, 212)";
                                    span.classList.remove("grey");

                                    if (completeImg) {
                                        completeImg.replaceChildren();
                                        completeImg.appendChild(tickImg);
                                    }
                                    localStorage.setItem("todoData", JSON.stringify(listArray));
                                }
                            });
                        });
                    }
                });
            }
            
            const listToday = document.querySelector(`#content .list .today`);
            const listTomorrow = document.querySelector(`#content .list .tomorrow`);
            const listUpcoming = document.querySelector(`#content .list .upcoming`);
            if (listToday.children.length + listTomorrow.children.length + listUpcoming.children.length >= 11) {
                const h3 = document.querySelectorAll("#content .list h3");
                h3.forEach(itemh3 => {
                    itemh3.style.backgroundColor = "transparent";
                    requestAnimationFrame(() => {
                        itemh3.style.backgroundColor = "#2a2d33";
                    });
                });
            }
        }
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
        timeInput.setAttribute("id", "dateTimePicker");
        timeInput.setAttribute("type", "text");
        timeInput.setAttribute("placeholder", "Select Date");
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
            dialogPropertiesChildren.dialogOpen(dialogReminder);

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

            dialogPropertiesChildren.dialogClose(dialogReminder);
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
            } else if (date === getNextDateFormatted(yyyy, mm, dd)) {
                bellBtn.replaceChildren();
                const weekDay = new Date(parseInt(yyyy), parseInt(mm)-1, parseInt(dd)+1);
                const weekDayName = weekDay.toLocaleDateString("en-US", { weekday: "short"});
                bellBtn.textContent = `${weekDayName} ${time}`;
            } else {
                bellBtn.replaceChildren();
                bellBtn.textContent = `${date}`;
            }
            
            if (datePickerInstance) {
                datePickerInstance.destroy();
                datePickerInstance = null;
            }

            dialogPropertiesChildren.dialogClose(dialogReminder);
        });

        dialogReminder.addEventListener("click", (e) => {
            if (e.target === dialogReminder) {
                timeInput.value = "";
                if (datePickerInstance) {
                    datePickerInstance.destroy();
                    datePickerInstance = null;
                }

                dialogPropertiesChildren.dialogClose(dialogReminder);
            }
        });
    }
    
    function getNextDateFormatted(year, month, date) {
        const dateObj = new Date(parseInt(year), parseInt(month)-1, parseInt(date));
        dateObj.setDate(dateObj.getDate()+1);
        const newDd = String(dateObj.getDate()).padStart(2, "0");
        const newMm = String(dateObj.getMonth()+1).padStart(2, "0");
        const newYyyy = String(dateObj.getFullYear());

        return `${newDd}-${newMm}-${newYyyy}`;
    }

    function taskHideReveal() {
        const today = document.querySelector("#content .list .today h3");
        const tomorrow = document.querySelector("#content .list .tomorrow h3");
        const upcoming = document.querySelector("#content .list .upcoming h3");
        
        today.addEventListener("click", () => {
            const tasks = document.querySelectorAll("#content .list .today .task");
            const list = document.querySelector(`#content .list`);
            const h3 = document.querySelectorAll("#content .list h3");
            tasks.forEach(task => {
                task.classList.toggle("fadeIn");
                if (!task.classList.contains("fadeIn")) {
                    task.style.display = "none";
                } else {
                    task.style.display = "block";
                }
            });

            if (list.scrollHeight > list.clientHeight) {
                h3.forEach(itemh3 => {
                    itemh3.style.backgroundColor = "transparent";
                    requestAnimationFrame(() => {
                        itemh3.style.backgroundColor = "#2a2d33";
                    });
                });
            } else {
                h3.forEach(itemh3 => {
                    itemh3.style.backgroundColor = "#2a2d33";
                    requestAnimationFrame(() => {
                        itemh3.style.backgroundColor = "transparent";
                    });
                });
            }
        });

        tomorrow.addEventListener("click", () => {
            const tasks = document.querySelectorAll("#content .list .tomorrow .task");
            const list = document.querySelector(`#content .list`);
            const h3 = document.querySelectorAll("#content .list h3");
            tasks.forEach(task => {
                task.classList.toggle("fadeIn");
                if (!task.classList.contains("fadeIn")) {
                    task.style.display = "none";
                } else {
                    task.style.display = "block";
                }
            });

            if (list.scrollHeight > list.clientHeight) {
                h3.forEach(itemh3 => {
                    itemh3.style.backgroundColor = "transparent";
                    requestAnimationFrame(() => {
                        itemh3.style.backgroundColor = "#2a2d33";
                    });
                });
            } else {
                h3.forEach(itemh3 => {
                    itemh3.style.backgroundColor = "#2a2d33";
                    requestAnimationFrame(() => {
                        itemh3.style.backgroundColor = "transparent";
                    });
                });
            }
        });
        
        upcoming.addEventListener("click", () => {
            const tasks = document.querySelectorAll("#content .list .upcoming .task");
            const list = document.querySelector(`#content .list`);
            const h3 = document.querySelectorAll("#content .list h3");
            tasks.forEach(task => {
                task.classList.toggle("fadeIn");
                if (!task.classList.contains("fadeIn")) {
                    task.style.display = "none";
                } else {
                    task.style.display = "block";
                }
            });

            if (list.scrollHeight > list.clientHeight) {
                h3.forEach(itemh3 => {
                    itemh3.style.backgroundColor = "transparent";
                    requestAnimationFrame(() => {
                        itemh3.style.backgroundColor = "#2a2d33";
                    });
                });
            } else {
                h3.forEach(itemh3 => {
                    itemh3.style.backgroundColor = "#2a2d33";
                    requestAnimationFrame(() => {
                        itemh3.style.backgroundColor = "transparent";
                    });
                });
            }
        });
    }

    function detailCard(taskUID) {
        const task = document.querySelector(`#content .list .${CSS.escape(taskUID)} label`);
        const span = document.querySelector(`#content .list .${CSS.escape(taskUID)} label span`);
        const checkbox = document.querySelector(`#content .list .${CSS.escape(taskUID)} label input#${CSS.escape(taskUID)}`);
        const taskTextNode = Array.from(task.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
        const targetClass = listArray.find(item => item.ListId === UID);

        const contentItemDetail = document.createElement("div");
        const header = document.createElement("div");
        const title = document.createElement("div");
        const buttons = document.createElement("div");
        const notes = document.createElement("div");
        const attachments = document.createElement("div");
        const name = document.querySelector("#left .listName #listname");
        const trashImg = document.createElement("img");
        const tickImg = document.createElement("img");
        const checkImg = document.createElement("img");
        const bellImg = document.createElement("img");
        const moveImg = document.createElement("img");
        const starImg = document.createElement("img");
        const jpg = document.createElement("img");
        jpg.classList.add("jpg");
        const pdf = document.createElement("img");
        pdf.classList.add("pdf");
        const png = document.createElement("img");
        png.classList.add("png");
        const word = document.createElement("img");
        word.classList.add("word");
        jpg.src = fileJPG;
        pdf.src = filePDF;
        png.src = filePNG;
        word.src = fileWord;
        trashImg.src = trash;
        tickImg.src = tick;
        bellImg.src = bell2;
        moveImg.src = move;
        starImg.src = star2;
        checkImg.src = checkCircle;

        contentItemDetail.classList.add(`${taskUID}`);
        contentItemDetail.classList.add(`detail`);
        header.classList.add("header");
        title.classList.add("title");
        buttons.classList.add("buttons");
        notes.classList.add("notes");
        attachments.classList.add("attachments");

        const headDelete = document.createElement("button");
        const complete = document.createElement("button");
        headDelete.classList.add(`${taskUID}`);
        headDelete.classList.add("deleteButton");
        complete.classList.add(`${taskUID}`);
        complete.classList.add("complete");

        const inputTask = document.createElement("textarea");
        inputTask.setAttribute("id", "taskName");
        inputTask.setAttribute("rows", "1");
        inputTask.setAttribute("style", "overflow:hidden;");
        inputTask.setAttribute("maxlength", "37");
        inputTask.setAttribute("placeholder", "Add task name");
        inputTask.setAttribute("autocomplete", "off");
        inputTask.setAttribute("spellcheck", "false");
        inputTask.value = taskTextNode.nodeValue.trim();
        inputTask.style.height = "4.66vh"; // 34px
        inputTask.addEventListener("input", () => {
            inputTask.style.height = "auto";
            inputTask.style.height = (inputTask.scrollHeight / window.innerHeight)*100 + "vh";
            taskTextNode.nodeValue = inputTask.value;
            Object.keys(targetClass).forEach(key => Object.entries(targetClass[key]).forEach(([taskKey, taskObj]) => {
                if (typeof taskObj === "object" && taskObj.id === taskUID) {
                    taskObj.text = inputTask.value;
                }
            }));
            localStorage.setItem("todoData", JSON.stringify(listArray));
        });

        const reminder = document.createElement("button");
        reminder.classList.add(`${taskUID}`);
        reminder.classList.add("reminder");
        const reminderText = document.createTextNode("Reminder");
        const listName = document.createElement("button");
        listName.classList.add(`${taskUID}`);
        listName.classList.add("listName");
        const listNameText = document.createTextNode(`${name.value}`);
        const priority = document.createElement("button");
        priority.classList.add(`${taskUID}`);
        priority.classList.add("priority");
        const priorityText = document.createTextNode("Priority");

        const label = document.createElement("label");
        label.setAttribute("for", "note");
        label.innerHTML = `<p>NOTES</p>`;
        const inputNote = document.createElement("textarea");
        inputNote.setAttribute("id", "note");
        inputNote.setAttribute("rows", "1");
        inputNote.setAttribute("style", "overflow:hidden;");
        inputNote.setAttribute("maxlength", "371");
        inputNote.setAttribute("placeholder", "Insert your note");
        inputNote.setAttribute("autocomplete", "off");
        inputNote.setAttribute("spellcheck", "false");
        inputNote.style.height = "3.01vh"; // 22px
        Object.keys(targetClass).forEach(key => Object.entries(targetClass[key]).forEach(([taskKey, taskObj]) => {
            if (typeof taskObj === "object" && taskObj.id === taskUID) {
                if (taskObj.note !== undefined) {
                    inputNote.value = taskObj.note;
                }
            }
        }));
        inputNote.addEventListener("input", () => {
            inputNote.style.height = "auto";
            inputNote.style.height = (inputNote.scrollHeight / window.innerHeight)*100 + "vh";
        });
        
        attachments.innerHTML = `<p>ATTACHMENT</p>`;
        const labelAttach = document.createElement("label");
        labelAttach.setAttribute("for", "attachment");
        const inputAttach = document.createElement("input");
        inputAttach.setAttribute("type", "file");
        inputAttach.setAttribute("id", "attachment");
        labelAttach.innerHTML = "<p>Choose File</p>";
        labelAttach.appendChild(pdf);
        labelAttach.appendChild(jpg);
        labelAttach.appendChild(png);
        labelAttach.appendChild(word);

        content.appendChild(contentItemDetail);
        requestAnimationFrame(() => {
            contentItemDetail.classList.add("fadeIn");
        });
        contentItemDetail.appendChild(header);
        header.appendChild(complete);
        if (checkbox.checked) {
            complete.appendChild(checkImg);
            checkImg.style.filter = "invert(46%) sepia(96%) saturate(1918%) hue-rotate(185deg) brightness(101%) contrast(102%)";
        } else {
            complete.appendChild(tickImg);
        }
        header.appendChild(headDelete);
        headDelete.appendChild(trashImg);
        contentItemDetail.appendChild(title);
        title.appendChild(inputTask);
        contentItemDetail.appendChild(buttons);
        buttons.appendChild(reminder);
        reminder.appendChild(bellImg);
        reminder.appendChild(reminderText);
        buttons.appendChild(listName);
        listName.appendChild(moveImg);
        listName.appendChild(listNameText);
        buttons.appendChild(priority);
        priority.appendChild(starImg);
        priority.appendChild(priorityText);
        if (span.classList.contains("yellow")) {
            priority.classList.add("on");
        }
        contentItemDetail.appendChild(notes);
        notes.appendChild(label);
        label.appendChild(inputNote);
        contentItemDetail.appendChild(attachments);
        attachments.appendChild(labelAttach);
        labelAttach.appendChild(inputAttach);
        
        const completeImg = document.querySelector("#content .detail .header .complete");
        completeImg.addEventListener("click", () => {
            if (checkbox.checked) {
                checkbox.checked = false;
                complete.replaceChildren();
                complete.appendChild(tickImg);
                Object.keys(targetClass).forEach(key => Object.entries(targetClass[key]).forEach(([taskKey, taskObj]) => {
                    if (typeof taskObj === "object" && taskObj.id === taskUID) {
                        taskObj.check = false;
                    }
                }));

                task.style.textDecoration = "none";
                task.style.color = "rgb(212, 212, 212)";
                span.classList.remove("grey");
                localStorage.setItem("todoData", JSON.stringify(listArray));
            } else if (!checkbox.checked) {
                checkbox.checked = true;
                complete.replaceChildren();
                complete.appendChild(checkImg);
                checkImg.style.filter = "invert(46%) sepia(96%) saturate(1918%) hue-rotate(185deg) brightness(101%) contrast(102%)";
                Object.keys(targetClass).forEach(key => Object.entries(targetClass[key]).forEach(([taskKey, taskObj]) => {
                    if (typeof taskObj === "object" && taskObj.id === taskUID) {
                        taskObj.check = true;
                    }
                }));

                task.style.textDecoration = "line-through";
                task.style.color = "rgb(163, 162, 162)";
                span.classList.add("grey");
                localStorage.setItem("todoData", JSON.stringify(listArray));
            }
        });

        inputNote.addEventListener("input", () => {
            Object.keys(targetClass).forEach(key => Object.entries(targetClass[key]).forEach(([taskKey, taskObj]) => {
                if (typeof taskObj === "object" && taskObj.id === taskUID) {
                    taskObj.note = inputNote.value;
                }
            }));
            localStorage.setItem("todoData", JSON.stringify(listArray));
        });

        inputAttach.addEventListener("change", (e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
                Object.keys(targetClass).forEach(key => Object.entries(targetClass[key]).forEach(([taskKey, taskObj]) => {
                    if (typeof taskObj === "object" && taskObj.id === taskUID) {
                        taskObj.attachment = selectedFile;
                    }
                }));
                localStorage.setItem("todoData", JSON.stringify(listArray));
            }
            const fileName = inputAttach.files[0] ? inputAttach.files[0].name : "Choose File";
            const p = document.querySelector(`#content .${CSS.escape(taskUID)}.detail .attachments label p`);
            p.textContent = fileName;
        });

        priority.addEventListener("click", () => {
            if (priority.classList.contains("on")) {
                priority.classList.remove("on");
                span.classList.remove("yellow");
                Object.keys(targetClass).forEach(key => Object.entries(targetClass[key]).forEach(([taskKey, taskObj]) => {
                    if (typeof taskObj === "object" && taskObj.id === taskUID) {
                        taskObj.priority = false;
                    }
                }));
                localStorage.setItem("todoData", JSON.stringify(listArray));
            } else if (!priority.classList.contains("on")) {
                priority.classList.add("on");
                span.classList.add("yellow");
                Object.keys(targetClass).forEach(key => Object.entries(targetClass[key]).forEach(([taskKey, taskObj]) => {
                    if (typeof taskObj === "object" && taskObj.id === taskUID) {
                        taskObj.priority = true;
                    }
                }));
                localStorage.setItem("todoData", JSON.stringify(listArray));
            }
        });

        headDelete.addEventListener("click", () => {
            Object.keys(targetClass).forEach(key => Object.entries(targetClass[key]).forEach(([taskKey, taskObj]) => {
                if (typeof taskObj === "object" && taskObj.id === taskUID) {
                    delete targetClass[key][taskKey];
                }
            }));
            localStorage.setItem("todoData", JSON.stringify(listArray));
            const list = document.querySelector("#content .list");
            const today = document.querySelector("#content .list .today");
            const tomorrow = document.querySelector("#content .list .tomorrow");
            const upcoming = document.querySelector("#content .list .upcoming");
            const listToday = document.querySelectorAll("#content .list .today .task");
            const listTomorrow = document.querySelectorAll("#content .list .tomorrow .task");
            const listUpcoming = document.querySelectorAll("#content .list .upcoming .task");
            const detail = document.querySelector("#content .detail");
            
            listToday.forEach(child => today.removeChild(child));
            listTomorrow.forEach(child => tomorrow.removeChild(child));
            listUpcoming.forEach(child => upcoming.removeChild(child));
            addTask(UID);
            detail.classList.remove("fadeIn")
            detail.classList.add("fadeOut")
            
            if (list.scrollHeight > list.clientHeight) {
                const h3 = document.querySelectorAll("#content .list h3");
                h3.forEach(itemh3 => {
                    itemh3.style.backgroundColor = "transparent";
                    requestAnimationFrame(() => {
                        itemh3.style.backgroundColor = "#2a2d33";
                    });
                });
            } else {
                const h3 = document.querySelectorAll("#content .list h3");
                h3.forEach(itemh3 => {
                    itemh3.style.backgroundColor = "#2a2d33";
                    requestAnimationFrame(() => {
                        itemh3.style.backgroundColor = "transparent";
                    });
                });
            }
        });
    }
}

const burgerDialog = (function () {
    const burger = document.querySelector("#left .burger");
    const burgerImg = document.querySelector("#left .burger img");
    const dialog = document.querySelector("#left .burgerDialog");
    
    dialog.style.display = "none";

    burger.addEventListener("click", (event) => {
        event.stopPropagation();
        if (dialog.style.display === "none") {
            dialog.style.display = "flex";
            dialog.style.opacity = "0";
            dialog.style.transform = "scale(0.95)";
            requestAnimationFrame(() => {
                dialog.style.opacity = "1";
                dialog.style.transform = "scale(1)";
                dialog.style.transition = "opacity 0.1s ease-in-out, transform 0.1s ease-in-out";
            });
            dialog.style.flexDirection = "column";
            dialog.style.left = `${((burger.offsetLeft-46) / window.innerWidth)*100}vw`;
            burger.style.backgroundColor = "#161616";
            burgerImg.style.filter = "invert(46%) sepia(96%) saturate(1918%) hue-rotate(185deg) brightness(101%) contrast(102%)";
        } else {
            dialog.style.opacity = "1";
            dialog.style.transform = "scale(1)";
            dialog.style.opacity = "0";
            dialog.style.transform = "scale(0.95)";
            dialog.style.transition = "opacity 0.1s ease-in-out, transform 0.1s ease-in-out";
            setTimeout(() => {
                dialog.style.display = "none";
            }, 100);
            burger.style.backgroundColor = "transparent";
            burgerImg.style.filter = "invert(70%)";
        }
    });

    document.addEventListener("click", () => {
        dialog.style.opacity = "1";
        dialog.style.transform = "scale(1)";
        dialog.style.opacity = "0";
        dialog.style.transform = "scale(0.95)";
        dialog.style.transition = "opacity 0.1s ease-in-out, transform 0.1s ease-in-out";
        setTimeout(() => {
            dialog.style.display = "none";
        }, 100);
        burger.style.backgroundColor = "transparent";
        burgerImg.style.filter = "invert(70%)";
    });

    dialog.addEventListener("click", (e) => {
        e.stopPropagation();
    });
})();

const ViewButton = (function () {
    const view = document.querySelector("#left .view");
    const viewText = document.querySelector("#left .view span");

    view.addEventListener("click", () => {
        const detail = document.querySelector("#content .detail");
        if (detail) {
            if (!detail.classList.contains("hidden")) {
                detail.classList.add("hidden");
                view.classList.add("hidden");
                viewText.textContent = "View";
            } else {
                detail.classList.remove("hidden");
                view.classList.remove("hidden");
                viewText.textContent = "Hide";
            }
        }
    });
})();

const searchButton = (function () {
    const search = document.querySelector("#right .search");
    const searchInput = document.querySelector("#right #rightSearch");
    const div = document.querySelector("#right div");

    search.addEventListener("click", () => {
        search.classList.toggle("on");
        if (search.classList.contains("on")) {
            searchInput.classList.add("on");
            div.classList.add("on");
        } else {
            searchInput.classList.remove("on");
            div.classList.remove("on");
        }
    });
})();

function deleteAction(UID) {
    const deleteListBtn = document.querySelector(`.listDelete.${CSS.escape(UID)}`);
    const burger = document.querySelector("#left .burger");
    const burgerImg = document.querySelector("#left .burger img");
    const dialog = document.querySelector("#left .burgerDialog");

    deleteListBtn.addEventListener("click", () => {
        const deleteDialog = document.querySelector(`.listDeleteConfirm.${CSS.escape(UID)}`);
        const deleteDialogDiv = document.querySelector(`.listDeleteConfirmDiv.${CSS.escape(UID)}`);
        const deleteYes = document.querySelector(`.listDeleteConfirmDiv.${CSS.escape(UID)} .yes.${CSS.escape(UID)}`);
        const deleteNo = document.querySelector(`.listDeleteConfirmDiv.${CSS.escape(UID)} .no.${CSS.escape(UID)}`);
        const listFade = document.querySelector("#content .list.fadeIn");
        const detailFade = document.querySelector("#content .detail.fadeIn");
        const newTask = document.querySelectorAll("#content .task.fadeIn");
        const targetIndex = listArray.findIndex(item => item.ListId === UID);//
        console.log(targetIndex);//
        console.log(listArray);//

        const newYes = deleteYes.cloneNode(true);//
        const newNo = deleteNo.cloneNode(true);//
        
        deleteYes.parentNode.replaceChild(newYes, deleteYes);//
        deleteNo.parentNode.replaceChild(newNo, deleteNo);//
        
        dialogPropertiesChildren.dialogOpen(deleteDialog);

        newYes.addEventListener("click", () => {//
            const listToDelete = document.querySelector(`.myList .${CSS.escape(UID)}`);
            const content = document.querySelector("#content");
            const myList = document.querySelector(".myList");

            newTask.forEach(task => {
                task.classList.remove("fadeIn");
                task.classList.add("fadeOut");
            });
            
            listArray.splice(targetIndex, 1);//
            localStorage.setItem("todoData", JSON.stringify(listArray));
    
            if (datePickerInstance) {
                datePickerInstance.destroy();
                datePickerInstance = null;
            }
            
            if (myList.children.length === 2) {
                listFade.classList.add("fadeOutLast");
                if (content.contains(detailFade)) {
                    detailFade.classList.add("fadeOutLast");
                }
            } else {
                listFade.classList.remove("fadeIn");
                if (content.contains(detailFade)) {
                    detailFade.classList.remove("fadeIn");
                }
                listFade.classList.add("fadeOut");
                if (content.contains(detailFade)) {
                    detailFade.classList.add("fadeOut");
                }
            }

            setTimeout(() => {
                content.replaceChildren();
            }, 300);
            
            if (listToDelete) {
                myList.removeChild(listToDelete);
            }
    
            const item = document.querySelector(".myList .item");
            const listName = document.querySelector(".listName #listname");
            const listDelete = document.querySelector(".listDelete");

            dialogPropertiesChildren.dialogClose(deleteDialog);
    
            if (item) {
                item.classList.add("highlighted");
                setTimeout(() => {
                    item.click();
                }, 300);
            } else {
                listName.value = "";
                listName.style.display = "none";
                listDelete.setAttribute("class","listDelete");
                burger.disabled = true;
                burger.classList.add("disabled");
                deleteDialog.setAttribute("class", "listDeleteConfirm");
                deleteDialogDiv.setAttribute("class", "listDeleteConfirmDiv");
                deleteYes.setAttribute("class","yes");
                deleteNo.setAttribute("class","no");
            }
            
            dialog.style.opacity = "1";
            dialog.style.transform = "scale(1)";
            dialog.style.opacity = "0";
            dialog.style.transform = "scale(0.95)";
            dialog.style.transition = "opacity 0.1s ease-in-out, transform 0.1s ease-in-out";
            setTimeout(() => {
                dialog.style.display = "none";
            }, 100);
            burger.style.backgroundColor = "transparent";
            burgerImg.style.filter = "invert(70%)";
        });

        newNo.addEventListener("click", () => {//
            dialogPropertiesChildren.dialogClose(deleteDialog);
            dialog.style.opacity = "1";
            dialog.style.transform = "scale(1)";
            dialog.style.opacity = "0";
            dialog.style.transform = "scale(0.95)";
            dialog.style.transition = "opacity 0.1s ease-in-out, transform 0.1s ease-in-out";
            setTimeout(() => {
                dialog.style.display = "none";
            }, 100);
            burger.style.backgroundColor = "transparent";
            burgerImg.style.filter = "invert(70%)";
        });
    });
}

function createBurgerDialogCover(UIDClass) {
    const burgerDialogCover = document.querySelector(".burgerDialogCover");

    burgerDialogCover.replaceChildren();
    const listDelete = document.createElement("button");
    const listDeleteConfirm = document.createElement("dialog");
    const h3 = document.createElement("h3");
    const p1 = document.createElement("p");
    const p2 = document.createElement("p");
    const listDeleteConfirmDiv = document.createElement("div");
    const yes = document.createElement("button");
    const no = document.createElement("button");
    listDelete.classList.add("listDelete");
    listDelete.classList.add(`${UIDClass}`);
    listDeleteConfirm.classList.add("listDeleteConfirm");
    listDeleteConfirm.classList.add(`${UIDClass}`);
    listDeleteConfirmDiv.classList.add("listDeleteConfirmDiv");
    listDeleteConfirmDiv.classList.add(`${UIDClass}`);
    h3.textContent = "Delete this list?";
    p1.textContent = "This action cannot be undone.";
    p2.textContent = "Are you sure you want to delete?";
    yes.classList.add("yes");
    yes.classList.add(`${UIDClass}`);
    no.classList.add("no");
    no.classList.add(`${UIDClass}`);
    listDelete.textContent = "Delete List";
    yes.textContent = "Yes";
    no.textContent = "No";
    burgerDialogCover.appendChild(listDelete);
    burgerDialogCover.appendChild(listDeleteConfirm);
    listDeleteConfirm.appendChild(h3);
    listDeleteConfirm.appendChild(p1);
    listDeleteConfirm.appendChild(p2);
    listDeleteConfirm.appendChild(listDeleteConfirmDiv);
    listDeleteConfirmDiv.appendChild(yes);
    listDeleteConfirmDiv.appendChild(no);
}

const dialogProperties = () => {
    function dialogOpen(dialog) {
        dialog.style.opacity = "0";
        dialog.style.transform = "scale(0.95)";
        dialog.showModal();
        dialog.style.opacity = "1";
        dialog.style.transform = "scale(1)";
        dialog.style.transition = "opacity 0.3s ease-in-out, transform 0.3s ease-in-out";
    }

    function dialogClose(dialog) {
        dialog.style.opacity = "1";
        dialog.style.transform = "scale(1)";
        dialog.style.opacity = "0";
        dialog.style.transform = "scale(0.95)";
        dialog.style.transition = "opacity 0.1s ease-in-out, transform 0.1s ease-in-out";
        setTimeout(() => {
            dialog.close();
        }, 100);
    }

    return { dialogOpen, dialogClose };
}

const dialogPropertiesChildren = dialogProperties();

export const listNameFunction = myListDialog.listNameEventListener;