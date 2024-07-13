import { argument, CommandContext, literal, string } from "@jsprismarine/brigadier";
import { Command, CommandSource } from "../command";

async function listItems(context: CommandContext<CommandSource>) {
    const source = context.getSource()
    const bot = source.bot

    
    if (bot.autoCiPut.items.size === 0) {
        bot.whisper(source.senderName, "There are no items in the item list.")
        return;
    }
    let itemsString = ""
    bot.autoCiPut.items.forEach(itemName => itemsString += itemName + ",")

    itemsString = itemsString.replace(/,$/g, "")

    bot.whisper(source.senderName, `Ci put Item list: [${itemsString}]`)
}

export default {
    register(dispatcher) {
        dispatcher.register(
            literal<CommandSource>("ciPut")
                .executes(async (context: CommandContext<CommandSource>) => {
                    const source = context.getSource()
                    const bot = source.bot
                
                    bot.whisper(source.senderName, bot.autoCiPut.enabled ? "Auto Ci Put enabled" : "Auto Ci Put disabled")
                })
                .then(
                    literal<CommandSource>("enable")
                        .executes(async (context: CommandContext<CommandSource>) => {
                            const source = context.getSource()
                            const bot = source.bot

                            if (bot.autoCiPut.enabled) {
                                bot.whisper(source.senderName, "Auto ci put was already enabled.")
                                return;
                            }
                            bot.autoCiPut.enable()
                            bot.whisper(source.senderName, "Enabled auto ci put.")
                        })
                    )
                .then(
                    literal<CommandSource>("disable")
                        .executes(async (context: CommandContext<CommandSource>) => {
                            const source = context.getSource()
                            const bot = source.bot

                            if (!bot.autoCiPut.enabled) {
                                bot.whisper(source.senderName, "Auto ci put was already disabled.")
                                return;
                            }

                            bot.autoCiPut.disable()
                            bot.whisper(source.senderName, "Disabled auto ci put.")
                        })
                
            )
                .then(
                    literal<CommandSource>("item")
                        .then(
                            literal<CommandSource>("add")
                                .then(
                                    argument<CommandSource, string>("item", string())
                                        .executes(async (context: CommandContext<CommandSource>) => {
                                            const source = context.getSource()
                                            const bot = source.bot

                                            const itemName = context.getArgument("item")

                                            if (bot.autoCiPut.items.has(itemName)) {
                                                bot.whisper(source.senderName, `${itemName} is already in the item list`)
                                                return;
                                            }

                                            bot.autoCiPut.items.add(itemName)
                                            bot.whisper(source.senderName, `Added ${itemName} to item list`)
                                        })
                                    )
                        )
                        .then(
                            literal<CommandSource>("remove")
                                .then(
                                    argument<CommandSource, string>("item", string())
                                        .executes(async (context: CommandContext<CommandSource>) => {
                                            const source = context.getSource()
                                            const bot = source.bot
                                        
                                            const itemName = context.getArgument("item")
                                        
                                            if (!bot.autoCiPut.items.has(itemName)) {
                                                bot.whisper(source.senderName, `${itemName} is not in the item list`)
                                                return;
                                            }
                                            bot.autoCiPut.items.delete(itemName)
                                            bot.whisper(source.senderName, `Removed ${itemName} from the item list.`)
                                        })
                                    )
                            )
                        .then(
                            literal<CommandSource>("clear")
                                .executes(async (context: CommandContext<CommandSource>) => {
                                    const source = context.getSource()
                                    const bot = source.bot
                                
                                    bot.autoCiPut.items.clear()
                                    bot.whisper(source.senderName, "Cleared the item list")
                                })
                            )
                        .then(
                            literal<CommandSource>("list")
                                .executes(listItems)
                            )
                        .executes(listItems)
            )   
        )
    }
} satisfies Command;