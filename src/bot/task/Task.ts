import { clear } from "console"
import { Bot } from "mineflayer"
import { clearInterval } from "timers"


export interface TaskInfo {
    name: string

    defaultDelay: number
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
    private _enabled: boolean
    private _delay: number


    // Private
    private taskTimer: NodeJS.Timeout


    protected constructor(bot: Bot, config: T, info: TaskInfo) {
        this.bot = bot
        this.config = config
        this.info = info

        this._enabled = false
        this.delay = info.defaultDelay
        this.taskTimer = null
    }

    get enabled() {
        return this._enabled
    }

    set enabled(v: boolean) {
        if (this.enabled === v)
            return;

        this._enabled = v

        if (v)
            this.enable()
        else
            this.disable()
    }

    get delay() {
        return this._delay
    }

    set delay(v: number) {
        if (this._delay === v)
            return;

        if (v > this.info.maxDelay)
            this.delay = this.info.maxDelay
        if (v < this.info.minDelay)
            this.delay = this.info.minDelay
        else
            this._delay = v

        if (this.enabled) {
            this.disable()
            this.enable()
        }
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
