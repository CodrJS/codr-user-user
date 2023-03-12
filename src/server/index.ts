import { start as ExpressStart, stop as ExpressStop } from "./express";
import { start as KafkaStart, stop as KafkaStop } from "./kafka";

export const Express = { start: ExpressStart, stop: ExpressStop };
export const Kafka = { start: KafkaStart, stop: KafkaStop };
