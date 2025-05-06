import "./style.css";
import { listArray } from "./logic.js";
import "./dom.js";
import { myListItems, contentCreate, deleteAction } from "./dom.js";
import profileLoad from "./images/profile.png";
import arrowRight from "./images/arrow-right-thin.svg";

const startupPage = (function () {
    (function loaderPage() {
        const body = document.querySelector("body");
        const name = document.querySelector("#sidebar .profile .name");
        const askName = document.createElement("div");
        const loader = document.createElement("div");
        const loaderImg = document.createElement("img");
        const nameSubmitImg = document.createElement("img");
        const inputName = document.createElement("input");
        const nameSubmit = document.createElement("button");
        nameSubmit.classList.add("nameSubmit");
        inputName.setAttribute("type", "text");
        inputName.setAttribute("id", "profileName");
        inputName.setAttribute("placeholder", "Add your name");
        inputName.setAttribute("maxlength", "9");
        inputName.setAttribute("autocomplete", "off");
        loaderImg.src = profileLoad;
        nameSubmitImg.src = arrowRight;
        loader.classList.add("loader");
        askName.classList.add("askName");
        body.appendChild(askName);
        askName.appendChild(loader);
        askName.appendChild(loaderImg);
        askName.appendChild(inputName);
        askName.appendChild(nameSubmit);
        nameSubmit.appendChild(nameSubmitImg);
    
        if (name.textContent === "") {
            askName.classList.add("show");
            nameSubmit.addEventListener("click", () => {
                if (inputName.value !== "") {
                    const userInputName = inputName.value;
                    askName.classList.remove("show");
                    name.textContent = userInputName;
                    setTimeout(() => {
                        body.removeChild(askName);
                    }, 200);
                }
            });
        } else {
            body.removeChild(askName);
        }
    })();
    
    const content = document.querySelector("#content");
    // const storedArray = JSON.parse(localStorage.getItem("todoData"));
    // console.log(storedArray);

    if (listArray.length === 0) {
        (function startupLists() {
            const openBtn = document.querySelector(".myList .add");
            const submitBtn = document.querySelector(".myList dialog .submit");
            const userInput = document.querySelector(".myList dialog input");
    
            (function personal() {
                openBtn.click();
                userInput.value = "Personal";
                submitBtn.click();
                localStorage.setItem("todoData", JSON.stringify(listArray));
                const personalFooter = document.querySelector("#content .list .footerInputBox #footerInput");
                const personalTaskReminder = document.querySelector("#content .list .footerInputBox .reminder");
                const personalTaskPriority = document.querySelector("#content .list .footerInputBox .priority");
                const personalTaskSubmitTime = document.querySelector("#content .list .footerInputBox .submitTime");
                const personalcloseBtn = document.querySelector("#content .list .footerInputBox .close");
                const personalAddTask = document.querySelector("#content .list .footerInputBox .addTask");
                const todayH3 = document.querySelector("#content .list .today h3");
                personalFooter.value = "Work-Out at gym";
                personalTaskReminder.click();
                personalTaskSubmitTime.click();
                personalAddTask.click();
                localStorage.setItem("todoData", JSON.stringify(listArray));
                personalFooter.value = "Take driving lessons";
                personalAddTask.click();
                localStorage.setItem("todoData", JSON.stringify(listArray));
                todayH3.click();
                personalFooter.value = "Visit the vet for annual vaccine";
                personalTaskPriority.click();
                personalAddTask.click();
                localStorage.setItem("todoData", JSON.stringify(listArray));
                todayH3.click();
                personalTaskReminder.click();
                personalcloseBtn.click();
                const personalTodayTasks = document.querySelectorAll("#content .list .today .task");
                const secondTask = personalTodayTasks[1];
                const personaltaskUID = secondTask.classList[0];
                const personalTodayCheckbox = document.querySelector(`#content .list .today input#${CSS.escape(personaltaskUID)}`);
                // personalTodayCheckbox.click();
                localStorage.setItem("todoData", JSON.stringify(listArray));
            })();
    
            (function grocery() {
                openBtn.click();
                userInput.value = "Shopping List";
                submitBtn.click();
                localStorage.setItem("todoData", JSON.stringify(listArray));
                const groceryFooter = document.querySelector("#content .list .footerInputBox #footerInput");
                const groceryTaskReminder = document.querySelector("#content .list .footerInputBox .reminder");
                const groceryTaskPriority = document.querySelector("#content .list .footerInputBox .priority");
                const groceryTaskSubmitTime = document.querySelector("#content .list .footerInputBox .submitTime");
                const grocerycloseBtn = document.querySelector("#content .list .footerInputBox .close");
                const groceryAddTask = document.querySelector("#content .list .footerInputBox .addTask");
                const todayH3 = document.querySelector("#content .list .today h3");
                groceryFooter.value = "Visit the shopping mart";
                groceryTaskReminder.click();
                groceryTaskSubmitTime.click();
                groceryAddTask.click();
                localStorage.setItem("todoData", JSON.stringify(listArray));
                groceryFooter.value = "Purchase Apricots and Oranges";
                groceryAddTask.click();
                localStorage.setItem("todoData", JSON.stringify(listArray));
                todayH3.click();
                groceryFooter.value = "Buy wet dog food";
                groceryTaskPriority.click();
                groceryAddTask.click();
                localStorage.setItem("todoData", JSON.stringify(listArray));
                todayH3.click();
                groceryTaskReminder.click();
                grocerycloseBtn.click();
                const groceryTodayTasks = document.querySelectorAll("#content .list .today .task");
                const secondTask = groceryTodayTasks[1];
                const grocerytaskUID = secondTask.classList[0];
                const groceryTodayCheckbox = document.querySelector(`#content .list .today input#${CSS.escape(grocerytaskUID)}`);
                // groceryTodayCheckbox.click();
                localStorage.setItem("todoData", JSON.stringify(listArray));
            })();
            
            const myListItems = document.querySelectorAll("#sidebar .myList .item");
            const secondItem = myListItems[0];
            const itemUID = secondItem.classList[0];
            const PersonalList = document.querySelector(`#sidebar .myList .${CSS.escape(itemUID)}.item`);
            PersonalList.click();
            localStorage.setItem("todoData", JSON.stringify(listArray));
            const personalTodayTasks = document.querySelectorAll("#content .list .today .task");
            const secondTask = personalTodayTasks[2];
            secondTask.click();
            localStorage.setItem("todoData", JSON.stringify(listArray));
        })();
    }// else {
    //     const myList = document.querySelector("#sidebar .myList");
    //     const content = document.querySelector("#content");

    //     storedArray.forEach(obj => {
    //         const UID = obj.ListId;
    //         const listName = obj.ListName;

    //         const item = document.createElement("div");
    //         item.classList.add(`${UID}`);
    //         item.classList.add("item");
    //         item.textContent = listName;
    //         myList.appendChild(item);
            
    //         myListItems(UID, listName);
    //     });
        
    //     const tasks = document.querySelectorAll("#content .list .today .task");
    //     const FirstTask = tasks[0];
    //     FirstTask.click();
    // }
})();