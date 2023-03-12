import { Kafka, Express } from "./server";

Kafka.start();
Express.start();

process.on("SIGINT", async function () {
  await Kafka.stop();
  Express.stop();

  process.exit();
});
