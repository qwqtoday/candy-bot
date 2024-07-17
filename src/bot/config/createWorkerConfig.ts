import WorkerConfig from "./WorkerConfig";

export default function createWorkerConfig(): WorkerConfig {
    return {
        tasks: {
            ciPut: {
                enabled: false,
                delay: 1000,
                config: {
                    items: new Set()
                }
            },
            ciGetToss: {
                enabled: false,
                delay: 1000,
                config: {
                    item: null,
                    count: 0
                }
            }
        }
    }
}