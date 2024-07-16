import { Bot, BotOptions, Plugin as MineflayerPlugin } from "mineflayer";

export interface TossItemsPlugin {
    tossItems: (itemType: number) => Promise<void>
    tossAllItems: () => Promise<void>
}

declare module "mineflayer" {
    interface Bot {
        tossItems: TossItemsPlugin
    }
}

export default ((bot: Bot, options: BotOptions) => {
    if (bot.tossItems !== undefined && bot.tossItems !== null)
        throw new Error("The auto attack plugin is being loaded multiple times")

    async function tossItems(itemType: number) {
        const targetItems = bot.inventory.items()
            .filter(item => item.type === itemType)

        for (const targetItem of targetItems) {
            await bot.tossStack(targetItem)
        }
    }

    async function tossAllItems() {
        for (const targetItem of bot.inventory.items()) {
            await bot.tossStack(targetItem)
        }
    }

    bot.tossItems = {
        tossItems: tossItems,
        tossAllItems: tossAllItems
    }
}) satisfies MineflayerPlugin