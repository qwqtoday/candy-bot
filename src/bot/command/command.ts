import { CommandDispatcher } from "@jsprismarine/brigadier";
import { Bot } from "mineflayer";
import attack from "./commands/attack";
import look from "./commands/look";
import tp from "./commands/tp";
import placeBlock from "./commands/placeBlock";
import ci from "./commands/ci";

export interface CommandSource {
  senderName: string;
  bot: Bot;
}

export interface Command {
  register: (dispatcher: CommandDispatcher<CommandSource>) => void;
}


const commands: Command[] = [
  attack,
  look,
  tp,
  placeBlock,
  ci,
] as const

export function getCommandDispatcher(): CommandDispatcher<CommandSource> {
  const dispatcher: CommandDispatcher<CommandSource> = new CommandDispatcher()

  commands.forEach(command => command.register(dispatcher))
  return dispatcher
}