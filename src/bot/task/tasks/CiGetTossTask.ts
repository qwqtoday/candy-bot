import { Bot, Chest } from "mineflayer";
import { AbstractTask } from "../Task";

export interface CiGetTossTaskConfig {
    item: string
    count: number
}

export default class CiGetTossTask extends AbstractTask<CiGetTossTaskConfig> {

    tickHandler: () => Promise<void>

    constructor(bot: Bot, config: CiGetTossTaskConfig = null) {
        if (config === null || config === undefined) {
            config = {
                item: null,
                count: 0
            }
        }

        super(
            bot,
            config,
            {
                name: "ciGetToss",
                defaultDelay: 1000,
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