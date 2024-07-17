import { tasks } from "../task/TaskManager"


export interface WorkerTaskConfig<T> {
    enabled: boolean
    delay: number
    config: T
}

export default interface WorkerConfig {
    tasks: { [name in keyof typeof tasks]: WorkerTaskConfig<InstanceType<typeof tasks[name]>["config"]> }
}