import { argument, CommandContext, literal, string } from "@jsprismarine/brigadier";
import { Command, CommandSource } from "../command";
import { db } from "../../../db";
import { addWorker } from "../../../db/controllers/workers_controller";
import { getUserLevelByUUID } from "../../../db/queries/users_queries";

export default {
    register(dispatcher) {
        dispatcher.register(
            literal<CommandSource>("add-bot")
                .then(
                    argument<CommandSource, string>("name", string())
                        .then(
                            argument<CommandSource, string>("owner", string())
                                .executes(async (context: CommandContext<CommandSource>) => {
                                    const source = context.getSource()
                                    const bot = source.bot

                                    const senderUUID = bot.players[source.senderName].uuid
                                    
                                    if (await getUserLevelByUUID(senderUUID) === 0) {
                                        bot.whisper(source.senderName, "You do not have permission to use this command.")
                                        return;
                                    } 
                                    
                                    const name = context.getArgument("name")
                                    const owner = context.getArgument("owner")


                                    const ownerUUID = bot.players[owner]?.uuid ?? null
                                    if (ownerUUID === null) {
                                        bot.whisper(source.senderName, "Cannot find the owner's uuid.")
                                        return;
                                    }

                                    await addWorker(name, ownerUUID)
                                    bot.whisper(source.senderName, `added worker ${name} with the owner ${ownerUUID}`)
                                })
                        )
                )
        )
    } 
} satisfies Command