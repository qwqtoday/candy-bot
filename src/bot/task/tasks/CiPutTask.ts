import { Bot, Chest } from "mineflayer";
import { AbstractTask } from "../Task";

export interface CiPutTaskConfig {
    items: Set<string>
}

export default class CiPutTask extends AbstractTask<CiPutTaskConfig> {

    windowOpenHandler: (window: Chest) => Promise<void>

    constructor(bot: Bot, config: CiPutTaskConfig = null) {
        if (config === null || config === undefined) {
            config = {
                items: new Set()
            }
        }

        super(
            bot,
            config,
            {
                name: "ciPut",
                defaultDelay: 1000,
                minDelay: 750,
                maxDelay: Infinity
            })

        this.windowOpenHandler = async (window) => {
            await this.handleWindowOpen(window)
        }
    }

    private async handleWindowOpen(window: Chest) {
        for (const itemName of this.config.items.values()) {
            const itemType = this.bot.registry.itemsByName[itemName]
            if (itemType === undefined)
                continue

            try {
                await window.deposit(itemType.id, null, 1728)
            } catch {

            }
        }
    }

    execute(): void {
        if (this.config.items.size === 0)
            return
        this.bot.chat("/ci put")
    }

    onEnable(): void {
        this.bot.on("windowOpen", this.windowOpenHandler)
    }

    onDisable(): void {
        this.bot.removeListener("windowOpen", this.windowOpenHandler)
    }


}