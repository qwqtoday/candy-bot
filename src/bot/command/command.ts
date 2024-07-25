import { CommandDispatcher } from "@jsprismarine/brigadier";
import { Bot } from "mineflayer";
import attack from "./commands/attack";
import look from "./commands/look";
import tp from "./commands/tp";
import placeBlock from "./commands/placeBlock";
import ci from "./commands/ci";
import TaskManager from "../task/TaskManager";
import toss from "./commands/toss";
import msg from "./commands/msg";

export interface CommandSource {
  senderName: string;
  bot: Bot;
  taskManager: TaskManager
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
  toss,
  msg
] as const

export function getCommandDispatcher(): CommandDispatcher<CommandSource> {
  const dispatcher: CommandDispatcher<CommandSource> = new CommandDispatcher()

  commands.forEach(command => command.register(dispatcher))
  return dispatcher
}