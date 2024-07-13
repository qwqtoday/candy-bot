import { argument, CommandContext, literal } from "@jsprismarine/brigadier";
import { Command, CommandSource } from "../command";
import BlockPosArgument from "../arguments/BlockPosArgument";
import { Vec3 } from "vec3";

export default {
    register(dispatcher) {
        dispatcher.register(
            literal<CommandSource>("lookAt")
                .then(
                    argument<CommandSource, Vec3>("coord", new BlockPosArgument())
                        .executes(async (context: CommandContext<CommandSource>) => {
                            const source = context.getSource()
                            const bot = source.bot

                            const coord: Vec3 = context.getArgument("coord")

                            await bot.lookAt(coord)
                            bot.whisper(source.senderName, `Looked at (${coord.x}, ${coord.y}, ${coord.z})`)
                        }
                    )
            )
        )
    }
} satisfies Command;