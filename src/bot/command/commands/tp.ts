// @ts-ignore
import {
  argument,
  CommandContext,
  integer,
  literal,
  string,
} from "@jsprismarine/brigadier";
import { CommandSource, Command } from "../command";

export default {
  register(dispatcher) {
    dispatcher.register(
      literal<CommandSource>("tp").then(
        argument<CommandSource, number>(
          "island_id",
          integer(0, Infinity),
        ).executes(async (context: CommandContext<CommandSource>) => {
          const source = context.getSource();
          const bot = source.bot;
          const island_id = context.getArgument("island_id");

          bot.chat(`/visit id ${island_id}`);
          bot.whisper(source.senderName, `Teleported to island #${island_id}`);
          return 0;
        }),
      ),
    );
  },
} satisfies Command;
