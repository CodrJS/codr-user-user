import { Kafka, Express, Mongo } from "./server";
import "@codrjs/config";

Mongo.start();
// Kafka.start();
Express.start();

process.on("SIGINT", async function () {
  // await Kafka.stop();
  Express.stop();
  Mongo.stop();

  process.exit();
});
