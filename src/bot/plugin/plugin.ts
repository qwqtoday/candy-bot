import { Bot, Plugin as MineflayerPlugin } from "mineflayer";
import auto_attack from "./plugins/auto_attack";
import auto_place_block from "./plugins/auto_place_block";
import auto_ci_put from "./plugins/auto_ci_put";


const plugins: MineflayerPlugin[] = [
    auto_attack,
    auto_place_block,
    auto_ci_put
] as const

export function loadPlugins(bot: Bot) {
    bot.loadPlugins(plugins)
}