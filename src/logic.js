export const listArray = [];

export class MyListClass {
    constructor(ListId) {
        this.ListId = ListId;
        this.today = new Today();
        this.tomorrow = new Tomorrow();
        this.upcoming = new Upcoming();
    }
}

export class Today {
    constructor() {
        this._taskCount = 0;
    }

    addTask(taskId, checkValue, task, date, weekDay, time, priority) {
        this._taskCount += 1;
        this[`task${this._taskCount}`] = {id: taskId, check: checkValue, text: task, date: date, weekDay: weekDay, time: time, priority: priority};
    }
}

export class Tomorrow {
    constructor() {
        this._taskCount = 0;
    }

    addTask(taskId, checkValue, task, date, weekDay, time, priority) {
        this._taskCount += 1;
        this[`task${this._taskCount}`] = {id: taskId, check: checkValue, text: task, date: date, weekDay: weekDay, time: time, priority: priority};
    }
}

export class Upcoming {
    constructor() {
        this._taskCount = 0;
    }

    addTask(taskId, checkValue, task, date, weekDay, time, priority) {
        this._taskCount += 1;
        this[`task${this._taskCount}`] = {id: taskId, check: checkValue, text: task, date: date, weekDay: weekDay, time: time, priority: priority};
    }
}