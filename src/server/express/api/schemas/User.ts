import type { OpenAPIV3_1 } from "openapi-types";

const UserSchema: OpenAPIV3_1.SchemaObject = {
  title: "User Schema",
  allOf: [{ $ref: "#/components/schemas/BaseSchema" }],
  required: ["email", "type", "role", "flags"],
  properties: {
    type: {
      type: "string",
      default: "anonymous",
      examples: ["anonymous", "external", "member"],
    },
    email: {
      type: "string",
    },
    role: {
      type: "string",
      default: "codr:annotator",
      examples: ["codr:annotator", "codr:researcher", "codr:admin"],
    },
    flags: {
      type: "object",
      properties: {
        isAnonymous: {
          type: "boolean",
          default: true,
          examples: [true, false],
        },
        isDisabled: {
          type: "boolean",
          default: false,
          examples: [true, false],
        },
        isDeleted: {
          type: "boolean",
          default: false,
          examples: [true, false],
        },
      },
    },
  },
};

export default UserSchema;
