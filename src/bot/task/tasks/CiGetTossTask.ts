import { Bot, Chest } from "mineflayer";
import { AbstractTask } from "../Task";
import { WorkerTaskConfig } from "../../config/WorkerConfig";

export interface CiGetTossTaskConfig {
    item: string
    count: number
}

export default class CiGetTossTask extends AbstractTask<CiGetTossTaskConfig> {

    tickHandler: () => Promise<void>

    constructor(bot: Bot, config: WorkerTaskConfig<CiGetTossTaskConfig>) {
        if (config === null || config === undefined) {
            config = {
                enabled: false,
                delay: 1000,
                config: {
                    item: null,
                    count: 0
                }
            }
        }

        super(
            bot,
            config,
            {
                name: "ciGetToss",
                minDelay: 750,
                maxDelay: Infinity
            })

        this.tickHandler = async () => {
            const items = bot.inventory.items()
                .filter(item => item.name === this.config.item)

            for (const item of items) {
                await bot.tossStack(item)
            }
        }
    }
    execute(): void {
        if (this.config.item === null || this.config.count === 0)
            return;

        this.bot.chat(`/ci get ${this.config.item} ${this.config.count}`)
    }

    onEnable(): void {
        this.bot.on("physicsTick", this.tickHandler)
    }

    onDisable(): void {
        this.bot.removeListener("physicsTick", this.tickHandler)
    }


}