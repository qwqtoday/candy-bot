import { argument, CommandContext, literal, string } from "@jsprismarine/brigadier";
import { Command, CommandSource } from "../command";
import BlockPosArgument from "../arguments/BlockPosArgument";
import { Vec3 } from "vec3";

async function listMobs(context: CommandContext<CommandSource>) {
    const source = context.getSource()
    const bot = source.bot

    if (bot.autoAttack.mobs.size === 0) {
        bot.whisper(source.senderName, "Currently attacking no mobs.")
        return;
    }
    let mobsString = ""
    bot.autoAttack.mobs.forEach(mobName => mobsString += mobName + ",")

    mobsString = mobsString.replace(/,$/g, "")

    bot.whisper(source.senderName, `Currently attacking [${mobsString}]`)
}

export default {
    register(dispatcher) {
        dispatcher.register(
            literal<CommandSource>("attack")
                .then(
                    literal<CommandSource>("enable")
                        .executes(async (context: CommandContext<CommandSource>) => {
                            const source = context.getSource()
                            const bot = source.bot

                            if (bot.autoAttack.enabled) {
                                bot.whisper(source.senderName, "Auto attack was already enabled.")
                                return;
                            }
                            bot.autoAttack.enable()
                            bot.whisper(source.senderName, "Enabled auto attack.")
                        })
                    )
                .then(
                    literal<CommandSource>("disable")
                        .executes(async (context: CommandContext<CommandSource>) => {
                            const source = context.getSource()
                            const bot = source.bot

                            if (!bot.autoAttack.enabled) {
                                bot.whisper(source.senderName, "Auto attack was already disabled.")
                                return;
                            }

                            bot.autoAttack.disable()
                            bot.whisper(source.senderName, "Disabled auto attack.")
                        })
                
                    )
                .then(
                    literal<CommandSource>("mob")
                        .then(
                            literal<CommandSource>("add")
                                .then(
                                    argument<CommandSource, string>("mob", string())
                                        .executes(async (context: CommandContext<CommandSource>) => {
                                            const source = context.getSource()
                                            const bot = source.bot

                                            const mobName = context.getArgument("mob")

                                            if (bot.autoAttack.mobs.has(mobName)) {
                                                bot.whisper(source.senderName, `The bot is already in the mob ${mobName}`)
                                                return;
                                            }

                                            bot.autoAttack.mobs.add(mobName)
                                            bot.whisper(source.senderName, `Added ${mobName} to mob list`)
                                        })
                                    )
                        )
                        .then(
                            literal<CommandSource>("remove")
                                .then(
                                    argument<CommandSource, string>("mob", string())
                                        .executes(async (context: CommandContext<CommandSource>) => {
                                            const source = context.getSource()
                                            const bot = source.bot
                                        
                                            const mobName = context.getArgument("mob")
                                        
                                            if (!bot.autoAttack.mobs.has(mobName)) {
                                                bot.whisper(source.senderName, `The bot was not in the mob list ${mobName}`)
                                                return;
                                            }
                                            bot.autoAttack.mobs.delete(mobName)
                                            bot.whisper(source.senderName, `Removed ${mobName} from mob list`)
                                        })
                                    )
                            )
                        .then(
                            literal<CommandSource>("clear")
                                .executes(async (context: CommandContext<CommandSource>) => {
                                    const source = context.getSource()
                                    const bot = source.bot
                                
                                    bot.autoAttack.mobs.clear()
                                    bot.whisper(source.senderName, "Cleared the mob list")
                                })
                            )
                        .then(
                            literal<CommandSource>("list")
                                .executes(listMobs)
                            )
                        .executes(listMobs)
                )
        )
    }
} satisfies Command;