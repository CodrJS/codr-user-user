import { IUser } from "@codrjs/models";
import { UserUtility } from "@/utils/UserUtility";
import { ObjectId } from "mongoose";
const Utility = new UserUtility();

/**
 * @todo Mock mongoose
 */

const testAdminUser: IUser = {
  _id: "0000" as unknown as ObjectId,
  type: "member",
  email: "DEMOUSER@codrjs.com",
  role: "codr:admin",
  flags: {
    isDisabled: false,
    isAnonymous: false,
  },
};

const testResearchUser: IUser = {
  _id: "1234" as unknown as ObjectId,
  type: "member",
  email: "DEMOUSER@codrjs.com",
  role: "codr:admin",
  flags: {
    isDisabled: false,
    isAnonymous: false,
  },
};

describe("User Utility", () => {
  test("Add user", () => {
    Utility.create(testAdminUser, {
      type: "anonymous",
      email: "anonymous@codrjs.com",
      role: "codr:annotator",
      flags: {
        isDisabled: false,
        isAnonymous: true,
      },
    }).then(user => {
      expect(user.details.user.email).toBe("anonymous@codrjs.com");
    }).catch(err => {});
  });
});
