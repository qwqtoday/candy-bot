import { Bot, BotOptions, Plugin as MineflayerPlugin } from "mineflayer";
export interface AutoAttackPlugin {
    enabled: boolean
    mobs: Set<string>

    enable: () => void
    disable: () => void
}

declare module "mineflayer" {
    interface Bot {
        autoAttack: AutoAttackPlugin
    }
}

export default ((bot: Bot, options: BotOptions) => {
    if (bot.autoAttack !== undefined && bot.autoAttack !== null) 
        throw new Error("The auto attack plugin is being loaded multiple times")

    let attack_timer: NodeJS.Timeout = null

    const enable = () => {
        if (bot.autoAttack.enabled) return;

        bot.autoAttack.enabled = true
        if (attack_timer !== null) {
            clearInterval(attack_timer)
        }

        attack_timer = setInterval(() => {
            let nearestEntity = bot.nearestEntity((entity) => 
                entity.position.distanceTo(bot.entity.position) < 5 &&
                bot.autoAttack.mobs.has(entity.name) &&
                entity !== bot.entity
            )

            if (nearestEntity === null) return;

            bot.lookAt(nearestEntity.position)
            bot.attack(nearestEntity)
        }, 1500)
    }

    const disable = () => {
        if (!bot.autoAttack.enabled) return;
        bot.autoAttack.enabled = false
        if (attack_timer !== null) {
            clearInterval(attack_timer)
        }
    }

    bot.autoAttack = {
        enable,
        disable,
        mobs: new Set(),
        enabled: false
    }
}) satisfies MineflayerPlugin