import { Operation } from "@dylanbulmer/openapi/types/Route";
import verifyJWT from "../../middlewares/verifyJWT";
import { UserUtility } from "../../../../../utils/UserUtility";

export const GET: Operation = [
  /* business middleware not expressible by OpenAPI documentation goes here */
  verifyJWT,
  (req, res) => {
    const util = new UserUtility();
    util
      .get(req.user, req.params.user)
      .then(res.status(200).json)
      .catch(res.status(500).json);
  },
];

// 3.0 specification
GET.apiDoc = {
  description: "Get user from database.",
  tags: ["User Management"],
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
