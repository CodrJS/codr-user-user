import { UserUtility } from "@/utils/UserUtility";
import { Error } from "@codrjs/models";
import { R200, R401, R403 } from "@dylanbulmer/openapi/classes/responses";
import { Operation } from "@dylanbulmer/openapi/types/Route";

export const GET: Operation =
  /* business middleware not expressible by OpenAPI documentation goes here */
  (req, res) => {
    const util = new UserUtility();
    const { email } = req.query;
    util
      .getByEmail(email as string)
      .then(resp => res.status(200).json(resp))
      .catch((err: Error) => res.status(err?.status || 500).json(err));
  };

// 3.0 specification
GET.apiDoc = {
  description: "INTERNAL: Get user from database.",
  tags: ["Internal API"],
  parameters: [
    {
      in: "query",
      name: "email",
      schema: {
        type: "string",
      },
      required: true,
      description: "Email of desired user to fetch.",
    },
  ],
  responses: {
    "200": {
      description: R200.description,
      content: {
        "application/json": {
          schema: {
            properties: {
              details: {
                type: "object",
                properties: {
                  user: {
                    $ref: "#/components/schemas/UserEntitySchema",
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
      description: R401.description,
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
      description: R403.description,
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
  },
};
