import { Error } from "@codrjs/models";
import { Operation } from "@dylanbulmer/openapi/types/Route";
import verifyJWT from "../../middlewares/verifyJWT";
import { UserUtility } from "../../../../../utils/UserUtility";

export const POST: Operation = [
  /* business middleware not expressible by OpenAPI documentation goes here */
  verifyJWT,
  (req, res) => {
    const util = new UserUtility();
    util
      .create(req.user, req.body)
      .then(res.status(200).json)
      .catch((err: Error) => res.status(err.status).json(err));
  },
];

// 3.0 specification
POST.apiDoc = {
  description: "Create a user in the database.",
  tags: ["User Management"],
  responses: {
    "200": {
      $ref: "#/components/responses/200",
      content: {
        "application/json": {
          schema: {
            properties: {
              details: {
                type: "object",
                properties: {
                  user: {
                    $ref: "#/components/schemas/UserSchema",
                  },
                },
              },
              message: {
                type: "string",
                examples: ["OK"],
              },
            },
          },
        },
      },
    },
    "401": {
      $ref: "#/components/responses/401",
      content: {
        "application/json": {
          schema: {
            properties: {
              status: {
                type: "number",
                examples: [401],
              },
              message: {
                type: "string",
                examples: ["User is unauthorized."],
              },
              details: {
                type: "object",
                properties: {},
              },
            },
          },
        },
      },
    },
    "403": {
      $ref: "#/components/responses/403",
      content: {
        "application/json": {
          schema: {
            properties: {
              status: {
                type: "number",
                examples: [403],
              },
              message: {
                type: "string",
                examples: ["User is forbidden from reading this user."],
              },
              details: {
                type: "object",
                properties: {},
              },
            },
          },
        },
      },
    },
    "500": {
      $ref: "#/components/responses/500",
      content: {
        "application/json": {
          schema: {
            properties: {
              status: {
                type: "number",
                examples: [500],
              },
              message: {
                type: "string",
                examples: [
                  "An unexpected error occurred when trying to create a user.",
                ],
              },
              details: {
                type: "object",
                properties: {},
              },
            },
          },
        },
      },
    },
  },
  security: [
    {
      Bearer: [],
    },
  ],
};
