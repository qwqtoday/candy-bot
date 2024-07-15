import { isMainThread, parentPort, workerData, Worker } from "worker_threads";
import { StartBotMessage, MainThreadMessage, WorkerMessage } from "./messages";
import { runningBots, startBot, stopBot } from "../bot/bot";
import { scheduler } from "timers/promises";

export interface WorkerThread {
    _worker: Worker;
    botCount: number;

    startBot: (worker_id: number) => void;
}

export interface WorkerBot {
    worker_id: number;
    workerThread?: WorkerThread
    state: "starting" | "running" | "stopped"
}


const MAX_WORKER_COUNT = 10;
const MIN_WORKER_BOT_COUNT = 3;


const workerThreads: WorkerThread[] = [];
const workerBots: WorkerBot[] = [];


let workerBotCount = 0;

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
        startBot(worker_id: number) {
            const workerBot = workerBots.find((workerBot) => workerBot.worker_id === worker_id)
            workerBot.workerThread = workerThread

            _worker.postMessage({
                type: "start-bot",
                id: worker_id,
            });
        },
    };

    workerThread._worker.on("message", (msg: WorkerMessage) => {
        switch (true) {
            case msg.type === "bot-ended":
                {
                    const workerBot = workerBots.find((workerBot) => workerBot.worker_id === msg.id)
                    workerBot.workerThread = null
                    workerBot.state = "stopped"

                    workerThread.botCount -= 1
                }
                break;
            case msg.type === "started-bot":
                {
                    const workerBot = workerBots.find((workerBot) => workerBot.worker_id === msg.id)
                    workerBot.state = "running"
                }
                break;
        }
    })
    return workerThread;
}




export async function addWorkerBot(worker_id: number) {
    workerBotCount += 1;
    if (
        workerThreads.length < MAX_WORKER_COUNT &&
        Math.ceil(workerBotCount / MIN_WORKER_BOT_COUNT) > workerThreads.length
    ) {
        workerThreads.push(startWorkerThread(workerThreads.length + 1));
    }

    let minWorkerThread: WorkerThread;
    for (let workerThread of workerThreads) {
        minWorkerThread =
            minWorkerThread === undefined ||
                workerThread.botCount < minWorkerThread.botCount
                ? workerThread
                : minWorkerThread;
    }

    workerBots.push({
        worker_id: worker_id,
        state: "stopped",
        workerThread: null
    })
}

function getSmallestWorkerThread(): WorkerThread {
    return workerThreads.reduce((threadA, threadB) => threadA.botCount < threadB.botCount ? threadA : threadB)
}

if (isMainThread) {
    setInterval(() => {
        const stoppedWorkerBots = workerBots.filter(workerBot => workerBot.state === "stopped");
        if (stoppedWorkerBots.length === 0) return;

        const stoppedWorkerBot = stoppedWorkerBots[Math.floor(Math.random() * stoppedWorkerBots.length)]

        if (stoppedWorkerBot !== undefined) {
            const workerThread = getSmallestWorkerThread()
            workerThread.startBot(stoppedWorkerBot.worker_id)
        }
    }, 15000)
}

if (!isMainThread) {
    parentPort.on("message", (_msg) => {
        const msg: MainThreadMessage = _msg;
        switch (true) {
            case msg.type === "start-bot":
                {
                    startBot((msg as StartBotMessage).id)
                }
                break;
        }
    });
}
