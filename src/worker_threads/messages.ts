export type WorkerMessage = BaseMessage | AddRemoveBotMessage;

export interface BaseMessage {
  type: string;
}

export interface AddRemoveBotMessage extends BaseMessage {
  type: "add-bot" | "remove-bot";
  id: number;
}
