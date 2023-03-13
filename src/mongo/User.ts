import { EmailRegex, IUser } from "@codrjs/models";
import type { Document } from "mongoose";
import { model, Schema } from "mongoose";
import {
  accessibleFieldsPlugin,
  AccessibleModel,
  accessibleRecordsPlugin,
} from "@casl/mongoose";

const UserSchema = new Schema<IUser>(
  {
    type: {
      type: String,
      enum: ["anonymous", "member", "external"],
      required: true,
      default: "member",
    },
    email: {
      type: String,
      required: true,
      match: [EmailRegex, "is invalid."],
      unique: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["codr:admin", "codr:researcher", "codr:annotator"],
      required: true,
      default: "codr:annotator",
    },
    flags: {
      type: {
        isAnonymous: Boolean,
        isDisabled: Boolean,
      },
      required: true,
      default: {
        isAnonymous: false,
        isDisabled: false,
      },
    },
    createdAt: { type: String },
    updatedAt: { type: String },
  },
  {
    timestamps: true,
  }
);

// exports User model.
export type UserDocument = IUser & Document;
UserSchema.plugin(accessibleFieldsPlugin);
UserSchema.plugin(accessibleRecordsPlugin);
const User = model<IUser, AccessibleModel<UserDocument>>("User", UserSchema);
export default User;
