export const listArray = [];

export class MyListClass {
    constructor(ListId, ListName) {
        this.ListId = ListId;
        this.ListName = ListName;
        this.today = new Today();
        this.tomorrow = new Tomorrow();
        this.upcoming = new Upcoming();
    }
}

export class Today {
    constructor() {
        this._taskCount = 0;
    }

    addTask(taskId, checkValue, task, date, weekDay, time, priority, note = "", attachment = null) {
        this._taskCount += 1;
        this[`task${this._taskCount}`] = {id: taskId, check: checkValue, text: task, date: date, weekDay: weekDay, time: time, priority: priority, note: note, attachment: attachment};
    }
}

export class Tomorrow {
    constructor() {
        this._taskCount = 0;
    }

    addTask(taskId, checkValue, task, date, weekDay, time, priority, note = "", attachment = null) {
        this._taskCount += 1;
        this[`task${this._taskCount}`] = {id: taskId, check: checkValue, text: task, date: date, weekDay: weekDay, time: time, priority: priority, note: note, attachment: attachment};
    }
}

export class Upcoming {
    constructor() {
        this._taskCount = 0;
    }

    addTask(taskId, checkValue, task, date, weekDay, time, priority, note = "", attachment = null) {
        this._taskCount += 1;
        this[`task${this._taskCount}`] = {id: taskId, check: checkValue, text: task, date: date, weekDay: weekDay, time: time, priority: priority, note: note, attachment: attachment};
    }
}