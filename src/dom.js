import { MyListClass, Today, Tomorrow, Upcoming, listArray } from "./logic.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/dark.css";
import arrowUp from "./images/arrow-up.svg";
import bell from "./images/bell-outline.svg";
import star from "./images/star-outline.svg";
import cross from "./images/window-close.svg";

const myListDialog = (function () {
    const dialog = document.querySelector(".myList dialog");
  
    const openBtn = document.querySelector(".myList .add");
    const closeBtn = document.querySelector(".myList dialog .close");
    const submitBtn = document.querySelector(".myList dialog .submit");
    const listName = document.querySelector(".listName");
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
            listName.textContent = userInput;
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

            const newList = new MyListClass(uniqueclass);
            listArray.push(newList);
            console.log(listArray);

            contentCreate(uniqueclass);
            deleteAction(uniqueclass);
            myListItems(uniqueclass, userInput);
            
            dialogPropertiesChildren.dialogClose(dialog);
        }
    });
})();

let datePickerInstance;

function myListItems(UID, input) {
    const content = document.querySelector("#content");
    const listName = document.querySelector(".listName");
    const item = document.querySelector(`.myList .${CSS.escape(UID)}`);
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
    
            listName.textContent = input;
            contentCreate(UID);
            deleteAction(UID);

            items.forEach(element => {
                element.classList.remove("highlighted");
            });
            item.classList.add("highlighted");
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
        contentItemFooter.innerHTML = `<input type="text" id="footerInput" placeholder="+ Add task" autocomplete="off">`;
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
        const todayDate = new Date();
        
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

                label.setAttribute("for", `${taskUID}`);
                checkbox.setAttribute("type", "checkbox");
                checkbox.setAttribute("id", `${taskUID}`);
                newTask.classList.add(`${taskUID}`);
                newTask.classList.add("task");
                
                if (timeInput.value === "" || date === currentDate) {
                    const labelText = document.createTextNode(`${input.value} ${time || ""}`);
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
                    checkbox.addEventListener("change", () => {
                        Object.entries(targetClass.today).forEach(([key, task]) => {
                            if (typeof task === "object" && task.id === taskUID && checkbox.checked) {
                                task.check = checkbox.checked;
                                label.style.textDecoration = "line-through";
                                label.style.color = "rgb(163, 162, 162)";
                                console.log(listArray);
                            } else if (typeof task === "object" && task.id === taskUID && !checkbox.checked) {
                                task.check = checkbox.checked;
                                label.style.textDecoration = "none";
                                label.style.color = "rgb(212, 212, 212)";
                                console.log(listArray);
                            }
                        });
                    });
                    targetClass.today.addTask(taskUID, checkbox.checked, input.value, null, null, time || "");
                    console.log(listArray);
                } else if (date === getNextDateFormatted(yyyy, mm, dd)) {
                    const weekDay = new Date(parseInt(yyyy), parseInt(mm)-1, parseInt(dd)+1);
                    const weekDayName = weekDay.toLocaleDateString("en-US", { weekday: "short"});
                    const labelText = document.createTextNode(`${input.value} ${weekDayName} ${time}`);
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
                    checkbox.addEventListener("change", () => {
                        Object.entries(targetClass.tomorrow).forEach(([key, task]) => {
                            if (typeof task === "object" && task.id === taskUID && checkbox.checked) {
                                task.check = checkbox.checked;
                                label.style.textDecoration = "line-through";
                                label.style.color = "rgb(163, 162, 162)";
                                console.log(listArray);
                            } else if (typeof task === "object" && task.id === taskUID && !checkbox.checked) {
                                task.check = checkbox.checked;
                                label.style.textDecoration = "none";
                                label.style.color = "rgb(212, 212, 212)";
                                console.log(listArray);
                            }
                        });
                    });
                    targetClass.tomorrow.addTask(taskUID, checkbox.checked, input.value, null, weekDayName, time);
                    console.log(listArray);
                } else {
                    const labelText = document.createTextNode(`${input.value} ${date}`);
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
                    checkbox.addEventListener("change", () => {
                        Object.entries(targetClass.upcoming).forEach(([key, task]) => {
                            if (typeof task === "object" && task.id === taskUID && checkbox.checked) {
                                task.check = checkbox.checked;
                                label.style.textDecoration = "line-through";
                                label.style.color = "rgb(163, 162, 162)";
                                console.log(listArray);
                            } else if (typeof task === "object" && task.id === taskUID && !checkbox.checked) {
                                task.check = checkbox.checked;
                                label.style.textDecoration = "none";
                                label.style.color = "rgb(212, 212, 212)";
                                console.log(listArray);
                            }
                        });
                    });
                    targetClass.upcoming.addTask(taskUID, checkbox.checked, input.value, date, null, null);
                    console.log(listArray);
                }

                if (list.scrollHeight > list.clientHeight) {
                    const h3 = document.querySelectorAll("#content .list h3");
                    h3.forEach(itemh3 => {
                        itemh3.style.backgroundColor = "transparent";
                        requestAnimationFrame(() => {
                            itemh3.style.backgroundColor = "#2a2d33";
                            itemh3.style.transition = "background-color 0.6s ease";
                        });
                    });
                }

                input.value = "";
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
        
                        label.setAttribute("for", `${taskUID}`);
                        checkbox.setAttribute("type", "checkbox");
                        checkbox.setAttribute("id", `${taskUID}`);

                        if (task.check) checkbox.checked = true;

                        newTask.classList.add(`${taskUID}`);
                        newTask.classList.add("task");
                        
                        const labelText = document.createTextNode(`${task.text} ${task.time}`);
                        today.appendChild(newTask);
                        requestAnimationFrame(() => {
                            newTask.classList.add("fadeIn");
                        });
                        newTask.appendChild(label);
                        label.appendChild(checkbox);
                        label.insertBefore(labelText, null);
                        checkbox.addEventListener("change", () => {
                            Object.entries(targetClass.today).forEach(([key, task]) => {
                                if (typeof task === "object" && task.id === taskUID && checkbox.checked) {
                                    task.check = checkbox.checked;
                                    label.style.textDecoration = "line-through";
                                    label.style.color = "rgb(163, 162, 162)";
                                    console.log(listArray);
                                } else if (typeof task === "object" && task.id === taskUID && !checkbox.checked) {
                                    task.check = checkbox.checked;
                                    label.style.textDecoration = "none";
                                    label.style.color = "rgb(212, 212, 212)";
                                    console.log(listArray);
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
        
                        label.setAttribute("for", `${taskUID}`);
                        checkbox.setAttribute("type", "checkbox");
                        checkbox.setAttribute("id", `${taskUID}`);

                        if (task.check) checkbox.checked = true;

                        newTask.classList.add(`${taskUID}`);
                        newTask.classList.add("task");
                        
                        const labelText = document.createTextNode(`${task.text} ${task.weekDay} ${task.time}`);
                        tomorrow.appendChild(newTask);
                        requestAnimationFrame(() => {
                            newTask.style.display = "none";
                        });
                        newTask.appendChild(label);
                        label.appendChild(checkbox);
                        label.insertBefore(labelText, null);
                        checkbox.addEventListener("change", () => {
                            Object.entries(targetClass.tomorrow).forEach(([key, task]) => {
                                if (typeof task === "object" && task.id === taskUID && checkbox.checked) {
                                    task.check = checkbox.checked;
                                    label.style.textDecoration = "line-through";
                                    label.style.color = "rgb(163, 162, 162)";
                                    console.log(listArray);
                                } else if (typeof task === "object" && task.id === taskUID && !checkbox.checked) {
                                    task.check = checkbox.checked;
                                    label.style.textDecoration = "none";
                                    label.style.color = "rgb(212, 212, 212)";
                                    console.log(listArray);
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
        
                        label.setAttribute("for", `${taskUID}`);
                        checkbox.setAttribute("type", "checkbox");
                        checkbox.setAttribute("id", `${taskUID}`);

                        if (task.check) checkbox.checked = true;

                        newTask.classList.add(`${taskUID}`);
                        newTask.classList.add("task");
                        
                        const labelText = document.createTextNode(`${task.text} ${task.date}`);
                        upcoming.appendChild(newTask);
                        requestAnimationFrame(() => {
                            newTask.style.display = "none";
                        });
                        newTask.appendChild(label);
                        label.appendChild(checkbox);
                        label.insertBefore(labelText, null);
                        checkbox.addEventListener("change", () => {
                            Object.entries(targetClass.upcoming).forEach(([key, task]) => {
                                if (typeof task === "object" && task.id === taskUID && checkbox.checked) {
                                    task.check = checkbox.checked;
                                    label.style.textDecoration = "line-through";
                                    label.style.color = "rgb(163, 162, 162)";
                                    console.log(listArray);
                                } else if (typeof task === "object" && task.id === taskUID && !checkbox.checked) {
                                    task.check = checkbox.checked;
                                    label.style.textDecoration = "none";
                                    label.style.color = "rgb(212, 212, 212)";
                                    console.log(listArray);
                                }
                            });
                        });
                    }
                });
            }
            
            const list = document.querySelector(`#content .list`);
            if (list.scrollHeight > list.clientHeight) {
                const h3 = document.querySelectorAll("#content .list h3");
                h3.forEach(itemh3 => {
                    itemh3.style.backgroundColor = "transparent";
                    requestAnimationFrame(() => {
                        itemh3.style.backgroundColor = "#2a2d33";
                        itemh3.style.transition = "background-color 0.6s ease";
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
                        itemh3.style.transition = "background-color 0.6s ease";
                    });
                });
            } else {
                h3.forEach(itemh3 => {
                    itemh3.style.backgroundColor = "#2a2d33";
                    requestAnimationFrame(() => {
                        itemh3.style.backgroundColor = "transparent";
                        itemh3.style.transition = "background-color 0.6s ease";
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
                        itemh3.style.transition = "background-color 0.6s ease";
                    });
                });
            } else {
                h3.forEach(itemh3 => {
                    itemh3.style.backgroundColor = "#2a2d33";
                    requestAnimationFrame(() => {
                        itemh3.style.backgroundColor = "transparent";
                        itemh3.style.transition = "background-color 0.6s ease";
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
                        itemh3.style.transition = "background-color 0.6s ease";
                    });
                });
            } else {
                h3.forEach(itemh3 => {
                    itemh3.style.backgroundColor = "#2a2d33";
                    requestAnimationFrame(() => {
                        itemh3.style.backgroundColor = "transparent";
                        itemh3.style.transition = "background-color 0.6s ease";
                    });
                });
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

        contentItemDetail.classList.add(`${UID}`);
        contentItemDetail.classList.add(`detail`);
        header.classList.add("header");
        title.classList.add("title");
        buttons.classList.add("buttons");
        notes.classList.add("notes");
        attachments.classList.add("attachments");

        const headDelete = document.createElement("button");
        headDelete.classList.add(`${UID}-deleteButton`)

        content.appendChild(contentItemDetail);
        requestAnimationFrame(() => {
            contentItemDetail.classList.add("fadeIn");
        });
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
            dialog.style.left = `${burger.offsetLeft-46}px`;
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
    
            if (datePickerInstance) {
                datePickerInstance.destroy();
                datePickerInstance = null;
            }
            
            if (myList.children.length === 2) {
                listFade.classList.add("fadeOutLast");
                detailFade.classList.add("fadeOutLast");
            } else {
                listFade.classList.remove("fadeIn");
                detailFade.classList.remove("fadeIn");
                listFade.classList.add("fadeOut");
                detailFade.classList.add("fadeOut");
            }

            setTimeout(() => {
                content.replaceChildren();
            }, 300);
            
            if (listToDelete) {
                myList.removeChild(listToDelete);
            }
    
            const item = document.querySelector(".myList .item");
            const listName = document.querySelector(".listName");
            const listDelete = document.querySelector(".listDelete");
            const taskDeleteSelect = document.querySelector(".taskDeleteSelect");

            dialogPropertiesChildren.dialogClose(deleteDialog);
    
            if (item) {
                item.classList.add("highlighted");
                setTimeout(() => {
                    item.click();
                }, 300);
            } else {
                listName.textContent = "";
                listDelete.setAttribute("class","listDelete");
                taskDeleteSelect.setAttribute("class","taskDeleteSelect");
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
    const taskDeleteSelect = document.createElement("button");
    const listDeleteConfirm = document.createElement("dialog");
    const h3 = document.createElement("h3");
    const p1 = document.createElement("p");
    const p2 = document.createElement("p");
    const listDeleteConfirmDiv = document.createElement("div");
    const yes = document.createElement("button");
    const no = document.createElement("button");
    listDelete.classList.add("listDelete");
    listDelete.classList.add(`${UIDClass}`);
    taskDeleteSelect.classList.add("taskDeleteSelect");
    taskDeleteSelect.classList.add(`${UIDClass}`);
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
    taskDeleteSelect.textContent = "Delete Task";
    yes.textContent = "Yes";
    no.textContent = "No";
    burgerDialogCover.appendChild(listDelete);
    burgerDialogCover.appendChild(taskDeleteSelect);
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