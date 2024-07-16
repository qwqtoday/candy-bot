import { Bot } from "mineflayer";
import CiPutTask from "./tasks/CiPutTask";
import { AbstractTask } from "./Task";
import CiGetTossTask from "./tasks/CiGetTossTask";

const tasks = {
    "ciPut": CiPutTask,
    "ciGetToss": CiGetTossTask
} as const

export default class TaskManager {
    private bot: Bot

    private taskConfig = {}
    private tasks: InstanceType<typeof tasks[keyof typeof tasks]>[]

    constructor(bot: Bot) {
        this.bot = bot

        // Load tasks
        this.tasks = Object.entries(tasks)
            .map(([name, task]) => new task(bot, this.taskConfig[name]))
    }


    getTask<T extends keyof typeof tasks>(name: T): InstanceType<typeof tasks[T]> | null {
        return this.tasks.find(task => task.info.name === name) as InstanceType<typeof tasks[T]>
    }
}