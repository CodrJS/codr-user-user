# Kafka Micro-Service Template

## Getting Started

Click "Use this template" in Github, then "Create a new repository."

## Kafka

Custom built consumer and producer classes can be imported from `@codrjs/kafka`.

### Creating a producer

```ts
import { Producer } from "@codrjs/kafka";

// this should be imported from "@codrjs/models"
interface TestMessage {
  hello: "world";
}

const Topic = "test-topic";
const TestProducer = new Producer<TestMessage>(Topic);

export default TestProducer;
```

### Creating a consumer

```ts
import type { KafkaMessage } from "kafkajs";
import { Consumer } from "@codrjs/kafka";

import dotenv from "dotenv";
dotenv.config();

// this should be imported from "@codrjs/models"
interface TestMessage {
  hello: "world";
}

const Topic = "test-topic";
const TopicGroup = process.env.KAFKA_CONSUMER_GROUP as string;

// @ts-ignore
const processor = function (payload: TestMessage, message: KafkaMessage) {
  // do stuff here
};

const TestConsumer = new Consumer<TestMessage>({
  processor,
  groupId: TopicGroup,
  topics: [Topic],
});

export default TestConsumer;
```

## Heath Checks

The `@codrjs/kafka` module automatically adds the Kafka admin client and all producers and consumers to the health check.

The only health checks that need to be added manually are for the express server and mongoose instance.

```ts
import { ServiceHealth } from "@codrjs/health";

// for Express, add the following events to the appropriate handlers.
//   This is done for you in this template.
ServiceHealth.handleEvent("express", "connect");
ServiceHealth.handleEvent("express", "disconnect");

// for Mongoose, add the connection property to the health monitor
import mongoose from "mongoose";

const client = mongoose.connect(...);
ServiceHealth.addMongo(client.connection);
```
