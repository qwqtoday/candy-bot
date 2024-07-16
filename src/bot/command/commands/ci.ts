import { argument, CommandContext, integer, literal, string } from "@jsprismarine/brigadier";
import { Command, CommandSource } from "../command";

async function listItems(context: CommandContext<CommandSource>) {
    const source = context.getSource()
    const bot = source.bot
    const taskManager = source.taskManager
    const ciPutTask = taskManager.getTask("ciPut")

    if (ciPutTask.config.items.size === 0) {
        bot.whisper(source.senderName, "There are no items in the item list.")
        return;
    }

    let itemsString = ""
    ciPutTask.config.items.forEach(itemName => itemsString += itemName + ",")

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
                    const taskManager = source.taskManager
                    const ciPutTask = taskManager.getTask("ciPut")

                    bot.whisper(source.senderName, ciPutTask.enabled ? "Auto Ci Put enabled" : "Auto Ci Put disabled")
                })
                .then(
                    literal<CommandSource>("enable")
                        .executes(async (context: CommandContext<CommandSource>) => {
                            const source = context.getSource()
                            const bot = source.bot
                            const taskManager = source.taskManager
                            const ciPutTask = taskManager.getTask("ciPut")

                            if (ciPutTask.enabled) {
                                bot.whisper(source.senderName, "Auto ci put was already enabled.")
                                return;
                            }
                            ciPutTask.enabled = true
                            bot.whisper(source.senderName, "Enabled auto ci put.")
                        })
                )
                .then(
                    literal<CommandSource>("disable")
                        .executes(async (context: CommandContext<CommandSource>) => {
                            const source = context.getSource()
                            const bot = source.bot
                            const taskManager = source.taskManager
                            const ciPutTask = taskManager.getTask("ciPut")

                            if (!ciPutTask.enabled) {
                                bot.whisper(source.senderName, "Auto ci put was already disabled.")
                                return;
                            }

                            ciPutTask.enabled = false
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
                                            const taskManager = source.taskManager
                                            const ciPutTask = taskManager.getTask("ciPut")

                                            const itemName = context.getArgument("item")

                                            if (ciPutTask.config.items.has(itemName)) {
                                                bot.whisper(source.senderName, `${itemName} is already in the item list`)
                                                return;
                                            }

                                            ciPutTask.config.items.add(itemName)
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
                                            const taskManager = source.taskManager
                                            const ciPutTask = taskManager.getTask("ciPut")

                                            const itemName = context.getArgument("item")

                                            if (!ciPutTask.config.items.has(itemName)) {
                                                bot.whisper(source.senderName, `${itemName} is not in the item list`)
                                                return;
                                            }
                                            ciPutTask.config.items.delete(itemName)
                                            bot.whisper(source.senderName, `Removed ${itemName} from the item list.`)
                                        })
                                )
                        )
                        .then(
                            literal<CommandSource>("clear")
                                .executes(async (context: CommandContext<CommandSource>) => {
                                    const source = context.getSource()
                                    const bot = source.bot
                                    const taskManager = source.taskManager
                                    const ciPutTask = taskManager.getTask("ciPut")

                                    ciPutTask.config.items.clear()
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

        dispatcher.register(
            literal<CommandSource>("ciGetToss")
                .then(
                    literal<CommandSource>("enable")
                        .executes(async (context: CommandContext<CommandSource>) => {
                            const source = context.getSource()
                            const bot = source.bot
                            const taskManager = source.taskManager
                            const ciGetTossTask = taskManager.getTask("ciGetToss")

                            if (ciGetTossTask.enabled) {
                                bot.whisper(source.senderName, "auto ci get toss is already enabled")
                                return;
                            }

                            ciGetTossTask.enabled = true
                            bot.whisper(source.senderName, `Enabled auto ci get toss.`)
                        })
                )
                .then(
                    literal<CommandSource>("disable")
                        .executes(async (context: CommandContext<CommandSource>) => {
                            const source = context.getSource()
                            const bot = source.bot
                            const taskManager = source.taskManager
                            const ciGetTossTask = taskManager.getTask("ciGetToss")
                            if (!ciGetTossTask.enabled) {
                                bot.whisper(source.senderName, "auto ci get toss is already disabled")
                                return;
                            }

                            ciGetTossTask.enabled = false
                            bot.whisper(source.senderName, `Disabled auto ci get toss.`)
                        })
                )
                .then(
                    literal<CommandSource>("set-item")
                        .then(
                            argument<CommandSource, string>("item", string())
                                .executes(async (context: CommandContext<CommandSource>) => {
                                    const source = context.getSource()
                                    const bot = source.bot
                                    const taskManager = source.taskManager
                                    const ciGetTossTask = taskManager.getTask("ciGetToss")

                                    ciGetTossTask.config.item = context.getArgument("item")
                                    bot.whisper(source.senderName, `Setted ci get toss item to ${ciGetTossTask.config.item}`)
                                })
                        )
                )
                .then(
                    literal<CommandSource>("set-delay")
                        .then(
                            argument<CommandSource, number>("delay", integer())
                                .executes(async (context: CommandContext<CommandSource>) => {
                                    const source = context.getSource()
                                    const bot = source.bot
                                    const taskManager = source.taskManager
                                    const ciGetTossTask = taskManager.getTask("ciGetToss")

                                    ciGetTossTask.delay = context.getArgument("delay")
                                    bot.whisper(source.senderName, `Setted delay to ${ciGetTossTask.delay}ms`)
                                })
                        )
                )
                .then(
                    literal<CommandSource>("set-count")
                        .then(
                            argument<CommandSource, number>("count", integer(1, 1728))
                                .executes(async (context: CommandContext<CommandSource>) => {
                                    const source = context.getSource()
                                    const bot = source.bot
                                    const taskManager = source.taskManager
                                    const ciGetTossTask = taskManager.getTask("ciGetToss")

                                    ciGetTossTask.config.count = context.getArgument("count")
                                    bot.whisper(source.senderName, `Setted get count to ${ciGetTossTask.config.count}`)
                                })
                        )
                )
                .executes(async (context: CommandContext<CommandSource>) => {
                    const source = context.getSource()
                    const bot = source.bot
                    const taskManager = source.taskManager
                    const ciGetTossTask = taskManager.getTask("ciGetToss")

                    bot.whisper(source.senderName, `Auto ci get toss is ${ciGetTossTask.enabled ? "enabled" : "disabled"}. The item is ${ciGetTossTask.config.item}, the count is ${ciGetTossTask.config.count} and the delay is ${ciGetTossTask.delay}`)
                })
        )
    }
} satisfies Command;