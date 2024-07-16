import { register } from "module";
import { Command, CommandSource } from "../command";
import { literal } from "@jsprismarine/brigadier";

export default {
    register(dispatcher) {
        dispatcher.register(
            literal<CommandSource>("tossItems")
                .executes(async (context) => {
                    const source = context.getSource()
                    const bot = source.bot

                    await bot.tossItems.tossAllItems()
                    bot.whisper(source.senderName, "Dropped all items.")
                })
        )
    }
} satisfies Command