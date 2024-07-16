import { Bot, Plugin as MineflayerPlugin } from "mineflayer";
import auto_attack from "./plugins/auto_attack";
import auto_place_block from "./plugins/auto_place_block";
import toss_items from "./plugins/toss_items";


const plugins: MineflayerPlugin[] = [
    // Utility
    toss_items,

    // tasks
    auto_attack,
    auto_place_block,
] as const

export function loadPlugins(bot: Bot) {
    bot.loadPlugins(plugins)
}