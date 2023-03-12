import { Operation } from "@dylanbulmer/openapi/types/Route";
import { ServiceHealth } from "@codrjs/health";

export const GET: Operation =
  /* business middleware not expressible by OpenAPI documentation goes here */
  (_req, res) => {
    res.status(200).json(ServiceHealth.getStatus());
  };

// 3.0 specification
GET.apiDoc = {
  description: "Check the server health",
  tags: ["System"],
  responses: {
    "200": {
      $ref: "#/components/responses/200",
      content: {
        "application/json": {
          schema: {
            properties: {
              detail: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    examples: ["OK"],
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
