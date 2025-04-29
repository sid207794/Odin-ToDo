export class MyListClass {
    constructor(ListId) {
        this.ListId = ListId;
        this.today = {};
        this.tomorrow = {};
        this.upcoming = {};
    }
}

export class Today {
    constructor() {
        this._taskCount = 0;
    }

    addTask(taskId, checkValue, task, date, weekDay, time) {
        this._taskCount += 1;
        this[`task${this._taskCount}`] = {id: taskId, check: checkValue, text: task, date: date, weekDay: weekDay, time: time};
    }
}

export class Tomorrow {
    constructor() {
        this._taskCount = 0;
    }

    addTask(taskId, checkValue, task, date, weekDay, time) {
        this._taskCount += 1;
        this[`task${this._taskCount}`] = {id: taskId, check: checkValue, text: task, date: date, weekDay: weekDay, time: time};
    }
}

export class Upcoming {
    constructor() {
        this._taskCount = 0;
    }

    addTask(taskId, checkValue, task, date, weekDay, time) {
        this._taskCount += 1;
        this[`task${this._taskCount}`] = {id: taskId, check: checkValue, text: task, date: date, weekDay: weekDay, time: time};
    }
}