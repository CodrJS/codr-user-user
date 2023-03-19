import { EmailRegex, IUser } from "@codrjs/models";
import { model, Schema } from "mongoose";
import {
  AccessibleFieldsModel,
  accessibleFieldsPlugin,
  AccessibleModel,
  accessibleRecordsPlugin,
} from "@casl/mongoose";

export type UserDocument = IUser & AccessibleFieldsModel<IUser>;
const UserSchema = new Schema<UserDocument>(
  {
    type: {
      type: String,
      enum: ["anonymous", "member", "external"],
      required: true,
      default: "anonymous",
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
UserSchema.plugin(accessibleFieldsPlugin);
UserSchema.plugin(accessibleRecordsPlugin);
const User = model<IUser, AccessibleModel<UserDocument>>("User", UserSchema);
export default User;
