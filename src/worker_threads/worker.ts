import { isMainThread, parentPort, workerData, Worker } from "worker_threads";
import { AddRemoveBotMessage, WorkerMessage } from "./messages";
import { runningBots, startBot, stopBot } from "../bot/bot";
import { scheduler } from "timers/promises";

export interface WorkerThread {
  _worker: Worker;
  botCount: number;

  addBot: (worker_id: number) => void;
  removeBot: (worker_id: number) => void;
}

export function startWorkerThread(workerThreadId: number): WorkerThread {
  if (!isMainThread) return;

  const _worker = new Worker(__filename, {
    workerData: {
      worker_thread_id: workerThreadId,
    },
  });

  const workerThread: WorkerThread = {
    _worker: _worker,
    botCount: 0,
    addBot(worker_id: number) {
      workerThread.botCount += 1;
      _worker.postMessage({
        type: "add-bot",
        id: worker_id,
      });
    },
    removeBot(worker_id: number) {
      workerThread.botCount -= 1;
      _worker.postMessage({
        type: "remove-bot",
        id: worker_id,
      });
    },
  };

  return workerThread;
}

if (!isMainThread) {
  const botIds: Set<number> = new Set();
  parentPort.on("message", (_msg) => {
    const msg: WorkerMessage = _msg;
    switch (true) {
      case msg.type == "add-bot":
        {
          botIds.add((msg as AddRemoveBotMessage).id);
          startBot((msg as AddRemoveBotMessage).id);
        }
        break;
      case msg.type == "remove-bot":
        {
          botIds.delete((msg as AddRemoveBotMessage).id);
          stopBot((msg as AddRemoveBotMessage).id);
        }
        break;
    }
  });

  setInterval(async () => {
    for (const worker_id of botIds) {
      if (!runningBots.has(worker_id)) {
        await startBot(worker_id);
        return;
      }
    }
  }, 15000);
}
