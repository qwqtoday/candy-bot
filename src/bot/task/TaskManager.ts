import { Bot } from "mineflayer";
import CiPutTask from "./tasks/CiPutTask";
import { AbstractTask } from "./Task";
import CiGetTossTask from "./tasks/CiGetTossTask";
import WorkerConfig from "../config/WorkerConfig";

export const tasks = {
    "ciPut": CiPutTask,
    "ciGetToss": CiGetTossTask
} as const

export default class TaskManager {
    private bot: Bot

    private config: WorkerConfig
    private tasks: InstanceType<typeof tasks[keyof typeof tasks]>[]

    constructor(bot: Bot, config: WorkerConfig) {
        this.bot = bot
        this.config = config

        // Load tasks
        this.tasks = Object.entries(tasks)
            .map(([name, task]) => new task(bot, this.config.tasks[name]))
    }


    getTask<T extends keyof typeof tasks>(name: T): InstanceType<typeof tasks[T]> | null {
        return this.tasks.find(task => task.info.name === name) as InstanceType<typeof tasks[T]>
    }
}