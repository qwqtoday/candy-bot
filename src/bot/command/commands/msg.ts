import { argument, greedyString, literal } from "@jsprismarine/brigadier";
import { Command, CommandSource } from "../command";

export default {
    register(dispatcher) {
        dispatcher.register(
            literal<CommandSource>("say")
                .then(
                    argument<CommandSource, string>("message", greedyString())
                        .executes(async (context) => {
                            const source = context.getSource()
                            const bot = source.bot
                            const msg = context.getArgument("message")

                            bot.chat(msg)
                        })
                )
        )
    }
} satisfies Command