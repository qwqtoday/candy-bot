import { argument, CommandContext, literal, word } from "@jsprismarine/brigadier";
import { Command, CommandSource } from "../command";


export default {
    register(dispatcher) {
        dispatcher.register(
            literal<CommandSource>("placeBlock")
                .then(
                    literal<CommandSource>("enable")
                        .executes(async (context: CommandContext<CommandSource>) => {
                            const source = context.getSource()
                            const bot = source.bot

                            if (bot.autoPlaceBlock.enabled) {
                                bot.whisper(source.senderName, "Auto place block is already enabled.")
                                return;
                            }

                            bot.autoPlaceBlock.enable()
                            bot.whisper(source.senderName, "Enabled auto place block.")
                        })
                )
                .then(
                    literal<CommandSource>("disable")
                        .executes(async (context: CommandContext<CommandSource>) => {
                            const source = context.getSource()
                            const bot = source.bot

                            if (!bot.autoPlaceBlock.enabled) {
                                bot.whisper(source.senderName, "Auto place block is not enabled.")
                                return;
                            }

                            bot.autoPlaceBlock.disable()
                            bot.whisper(source.senderName, "Disabled auto place block.")
                        })
                )
                .then(
                    literal<CommandSource>("set-block")
                        .then(
                            argument<CommandSource, string>("block", word())
                                .executes(async (context: CommandContext<CommandSource>) => {
                                    const source = context.getSource()
                                    const bot = source.bot
                                    const blockName: string = context.getArgument("block")

                                    bot.autoPlaceBlock.blockToPlace = blockName
                                    bot.whisper(source.senderName, `Setted the block to place to ${blockName}`)
                                })
                        )
                )
                .then(
                    literal<CommandSource>("set-target")
                        .then(
                            argument<CommandSource, string>("block", word())
                                .executes(async (context: CommandContext<CommandSource>) => {
                                    const source = context.getSource()
                                    const bot = source.bot
                                    const blockName: string = context.getArgument("block")

                                    bot.autoPlaceBlock.placeBlockOn = blockName
                                    bot.whisper(source.senderName, `Setted the block to place on to ${blockName}`)
                                }
                            )
                        )
                )
        )
    }
} satisfies Command