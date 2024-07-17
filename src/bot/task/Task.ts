import { clear } from "console"
import { Bot } from "mineflayer"
import { clearInterval } from "timers"
import { WorkerTaskConfig } from "../config/WorkerConfig"


export interface TaskInfo {
    name: string

    minDelay: number
    maxDelay: number
}


export abstract class AbstractTask<T> {
    // Public
    public info: TaskInfo
    public config: T


    // Protected
    protected bot: Bot


    // Public by getter and setter
    private _config: WorkerTaskConfig<T>

    // Private
    private taskTimer: NodeJS.Timeout


    protected constructor(bot: Bot, config: WorkerTaskConfig<T>, info: TaskInfo) {
        this.bot = bot
        this._config = config
        this.config = this._config.config
        this.info = info

        if (this.enabled) {
            bot.once("spawn", () => this.enable())
        }
    }

    get enabled() {
        return this._config.enabled
    }

    set enabled(v: boolean) {
        if (this.enabled === v)
            return;

        this._config.enabled = v

        if (v)
            this.enable()
        else
            this.disable()

        this.bot.saveWorkerConfig()
    }

    get delay() {
        return this._config.delay
    }

    set delay(v: number) {
        if (this._config.delay === v)
            return;

        if (v > this.info.maxDelay)
            this.delay = this.info.maxDelay
        if (v < this.info.minDelay)
            this.delay = this.info.minDelay
        else
            this._config.delay = v

        if (this.enabled) {
            this.disable()
            this.enable()
        }

        this.bot.saveWorkerConfig()
    }

    private enable() {
        if (this.taskTimer !== null) {
            clearInterval(this.taskTimer)
        }
        this.onEnable()
        this.taskTimer = setInterval(() => {
            this.execute()
        }, this.delay)
    }

    private disable() {
        if (this.taskTimer !== null) {
            clearInterval(this.taskTimer)
            this.taskTimer = null
        }
        this.onDisable()
    }

    abstract onEnable(): void
    abstract onDisable(): void

    abstract execute(): void
}
