import { workerData } from "worker_threads";

export function log(message: string, loglevel: string) {
  console.log(
    `[${loglevel}] <worker-thread-${workerData.worker_thread_id}> ${message}`,
  );
}

export function info(message: string) {
  log(message, "INFO");
}

export function warn(message: string) {
  log(message, "WARNING");
}

export function error(message: string) {
  log(message, "ERROR");
}
