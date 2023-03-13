import { types, IUser } from "@codrjs/models";
import { UserDocument } from "./User";

const permissions: types.Permissions<UserDocument, "User"> = {
  "codr:admin": (user, { can }) => {
    can("manage", "User");
  },
  "codr:researcher": (user, { can }) => {
    can("read", "User", { _id: user._id });
  },
  "codr:annotator": (user, { can }) => {
    can("read", "User", { _id: user._id });
  },
};

const UserAbility = (user: IUser) => types.DefineAbility(user, permissions);
export default UserAbility;
