import express from "express";
import path from "path";
import { initialize } from "@dylanbulmer/openapi";
import apiDoc from "./api-doc";
import { Error } from "@codrjs/models";

const app = express();

initialize({
  app,
  api: {
    doc: apiDoc,
    routes: path.join(__dirname, "routes"),
    expose: true,
    url: "/service/apidocs",
  },
  ui: {
    enable: true,
    url: "/service/docs",
  },
}).catch(console.error);

const ErrorHandler: express.ErrorRequestHandler = (err: Error, _req, res) => {
  return res.status(err.status).json({
    detail: {
      message: err.message,
    },
  });
};

app.set("errorHandler", ErrorHandler);

export default app;
