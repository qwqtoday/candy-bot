import { Bot, BotOptions, Chest, Plugin as MineflayerPlugin } from "mineflayer";
import { Vec3 } from "vec3";

export interface AutoCiPutPlugin {
    enabled: boolean

    items: Set<string>

    enable: () => void
    disable: () => void
}

declare module "mineflayer" {
    interface Bot {
        autoCiPut: AutoCiPutPlugin
    }
}

export default ((bot: Bot, options: BotOptions) => {
    if (bot.autoCiPut !== undefined && bot.autoCiPut !== null)
        throw new Error("The auto ci put plugin is being loaded multiple times")

    let ci_put_timer: NodeJS.Timeout = null

    const handleWindowOpen = async (window: Chest) => {
        if (!bot.autoCiPut.enabled) {
            bot.removeListener("windowOpen", handleWindowOpen)
            return;
        }

        for (let itemName of bot.autoCiPut.items) {
            const itemType = bot.registry.itemsByName[itemName]
            if (itemType === undefined)
                continue

            try {
                await window.deposit(itemType.id, null, 1728)
            } catch {
                
            }
        } 
    }

    const enable = () => {
        if (bot.autoCiPut.enabled) return;

        bot.autoCiPut.enabled = true
        if (ci_put_timer !== null) {
            clearInterval(ci_put_timer)
        }

        // Add window open handler
        bot.on("windowOpen", handleWindowOpen)

        // Ci put logic here.
        ci_put_timer = setInterval(() => {
            if (bot.autoCiPut.items.size === 0) {
                return;
            }
            
            bot.chat("/ci put")
        }, 1000)
    }

    const disable = () => {
        if (!bot.autoPlaceBlock.enabled) return;
        bot.autoPlaceBlock.enabled = false
        if (ci_put_timer !== null) {
            clearInterval(ci_put_timer)
        }
        bot.removeListener("windowOpen", handleWindowOpen)
    }

    bot.autoCiPut = {
        enable,
        disable,
        items: new Set(),
        enabled: false
    }
}) satisfies MineflayerPlugin