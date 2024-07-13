import { db } from "./db";
import workers from "./db/schema/workers";
import { startWorkerThread, WorkerThread } from "./worker_threads/worker";

const MAX_WORKER_COUNT = 10;
const MIN_WORKER_BOT_COUNT = 3;
let workerBotCount = 0;
const workerThreads: WorkerThread[] = [];

async function startWorkerBot(worker_id: number) {
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

  minWorkerThread.addBot(worker_id);
}

async function main() {
  const _workers = await db
    .select({
      id: workers.id,
    })
    .from(workers);

  _workers.forEach((worker) => startWorkerBot(worker.id));
}

main();
