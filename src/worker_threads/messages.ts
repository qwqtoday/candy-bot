export type MainThreadMessage = StartBotMessage | StopBotMessage;
export type WorkerMessage = BotEndedMessage | StartedBotMessage;

export interface BaseMessage {
  type: string;
}


export interface StartBotMessage extends BaseMessage {
  type: "start-bot";
  id: number;
}

export interface StopBotMessage extends BaseMessage {
  type: "stop-bot"
  id: number
}

export interface StartedBotMessage extends BaseMessage {
  type: "started-bot"
  id: number
}

export interface BotEndedMessage extends BaseMessage {
  type: "bot-ended";
  id: number;
}