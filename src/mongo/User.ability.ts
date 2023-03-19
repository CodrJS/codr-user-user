import { types, IUser } from "@codrjs/models";
import { UserDocument } from "./User";

const permissions: types.Permissions<UserDocument, "User"> = {
  /**
   * @TODO find a way to disallow system from creating system users.
   */
  "codr:system": (_user, { can, cannot }) => {
    can("manage", "User");
    cannot("update", "User", { role: { $eq: "codr:system" } });
    cannot("delete", "User", { role: { $eq: "codr:system" } });
  },
  /**
   * @TODO find a way to disallow admin from creating system users.
   */
  "codr:admin": (_user, { can, cannot }) => {
    can("manage", "User");
    cannot("update", "User", { role: { $eq: "codr:system" } });
    cannot("delete", "User", { role: { $eq: "codr:system" } });
  },
  "codr:researcher": (user, { can }) => {
    // can only read it's own user
    can("read", "User", { _id: user._id });
  },
  "codr:annotator": (user, { can }) => {
    // can only read it's own user
    can("read", "User", { _id: user._id });
  },
};

const UserAbility = (user: IUser) => types.DefineAbility(user, permissions);
export default UserAbility;
