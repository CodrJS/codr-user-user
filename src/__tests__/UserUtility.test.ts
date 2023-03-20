import { Error, IUser } from "@codrjs/models";
import { UserUtility } from "@/utils/UserUtility";
import { Types } from "mongoose";
import User from "@/entities/User";
const Utility = new UserUtility();

const testSystemUser: IUser = {
  _id: new Types.ObjectId(0),
  type: "member",
  email: "system@codrjs.com",
  role: "codr:system",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
};

const testAdminUser: IUser = {
  _id: new Types.ObjectId(1),
  type: "member",
  email: "admin@codrjs.com",
  role: "codr:admin",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
};

const testResearchUser: IUser = {
  _id: new Types.ObjectId(2),
  type: "member",
  email: "researcher@codrjs.com",
  role: "codr:researcher",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
};

const testAnnotatorUser: IUser = {
  _id: new Types.ObjectId(3),
  type: "member",
  email: "annotator@codrjs.com",
  role: "codr:annotator",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
};

const demoNewUser: IUser = {
  _id: new Types.ObjectId(4),
  type: "anonymous",
  email: "adduser@codrjs.com",
  role: "codr:annotator",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: true,
  },
};

describe("User Utility: Create", () => {
  test("System can add user", async () => {
    // mock function returns once
    User.findById = jest.fn().mockResolvedValueOnce(testSystemUser);
    User.create = jest.fn().mockResolvedValueOnce(demoNewUser);

    // run tests
    const user = await Utility.create(testSystemUser, demoNewUser);
    expect(user.details.user.email).toBe("adduser@codrjs.com");
  });

  test("Admin can add user", async () => {
    // mock function returns once
    User.findById = jest.fn().mockResolvedValueOnce(testAdminUser);
    User.create = jest.fn().mockResolvedValueOnce(demoNewUser);

    // run tests
    const user = await Utility.create(testAdminUser, demoNewUser);
    expect(user.details.user.email).toBe("adduser@codrjs.com");
  });

  test("Researcher cannot add user", () => {
    // mock function returns once
    User.findById = jest.fn().mockResolvedValueOnce(testResearchUser);
    User.create = jest.fn().mockResolvedValueOnce(demoNewUser);

    // run tests
    expect(Utility.create(testResearchUser, demoNewUser)).rejects.toEqual(
      new Error({
        status: 403,
        message: "User is forbidden from creating users.",
      })
    );
  });

  test("Annotator cannot add user", () => {
    // mock function returns once
    User.findById = jest.fn().mockResolvedValueOnce(testAnnotatorUser);
    User.create = jest.fn().mockResolvedValueOnce(demoNewUser);

    // run tests
    expect(Utility.create(testAnnotatorUser, demoNewUser)).rejects.toEqual(
      new Error({
        status: 403,
        message: "User is forbidden from creating users.",
      })
    );
  });
});

describe("User Utility: Read", () => {
  test("System can read another user", async () => {
    // mock function returns once
    User.findById = jest.fn().mockResolvedValueOnce(demoNewUser);

    // run tests
    const user = await Utility.get(
      testSystemUser,
      demoNewUser._id as unknown as string
    );
    expect(user.details.user.email).toBe("adduser@codrjs.com");
  });

  test("Admin can read another user", async () => {
    // mock function returns once
    User.findById = jest.fn().mockResolvedValueOnce(demoNewUser);

    // run tests
    const user = await Utility.get(
      testAdminUser,
      demoNewUser._id as unknown as string
    );
    expect(user.details.user.email).toBe("adduser@codrjs.com");
  });

  test("Researcher can read own user", async () => {
    // mock function returns once
    User.findById = jest.fn().mockResolvedValueOnce(testResearchUser);

    // run tests
    const user = await Utility.get(
      testResearchUser,
      testResearchUser._id as unknown as string
    );
    expect(user.details.user.email).toBe("researcher@codrjs.com");
  });

  test("Annotator can read own user", async () => {
    // mock function returns once
    User.findById = jest.fn().mockResolvedValue(testAnnotatorUser);

    // run tests
    const user = await Utility.get(
      testAnnotatorUser,
      testAnnotatorUser._id as unknown as string
    );
    expect(user.details.user.email).toBe("annotator@codrjs.com");
  });

  test("Researcher cannot read another user", () => {
    // mock function returns once
    User.findById = jest.fn().mockResolvedValueOnce(demoNewUser);

    // run tests
    expect(
      Utility.get(testResearchUser, demoNewUser._id as unknown as string)
    ).rejects.toEqual(
      new Error({
        status: 403,
        message: "User is forbidden from reading this user.",
      })
    );
  });

  test("Annotator cannot read another user", () => {
    // mock function returns once
    User.findById = jest.fn().mockResolvedValueOnce(demoNewUser);

    // run tests
    expect(
      Utility.get(testAnnotatorUser, demoNewUser._id as unknown as string)
    ).rejects.toEqual(
      new Error({
        status: 403,
        message: "User is forbidden from reading this user.",
      })
    );
  });
});

describe("User Utility: Update", () => {
  test("System can update another user", async () => {
    // mock function returns once
    User.findById = jest.fn().mockResolvedValueOnce(demoNewUser);
    User.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(demoNewUser);

    // run tests
    const user = await Utility.update(
      testSystemUser,
      demoNewUser._id as unknown as string,
      demoNewUser
    );
    expect(user.details.user.email).toBe("adduser@codrjs.com");
  });

  test("System cannot update system user", async () => {
    // mock function returns once
    User.findById = jest.fn().mockResolvedValueOnce(testSystemUser);

    // run tests
    expect(
      Utility.update(
        testSystemUser,
        testSystemUser._id as unknown as string,
        testSystemUser
      )
    ).rejects.toEqual(
      new Error({
        status: 403,
        message: "User is forbidden from updating this user.",
      })
    );
  });

  test("Admin can update another user", async () => {
    // mock function returns once
    User.findById = jest.fn().mockResolvedValueOnce(testAdminUser);
    User.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(demoNewUser);

    // run tests
    const user = await Utility.update(
      testAdminUser,
      demoNewUser._id as unknown as string,
      demoNewUser
    );
    expect(user.details.user.email).toBe("adduser@codrjs.com");
  });

  test("Admin cannot update system user", async () => {
    // mock function returns once
    User.findById = jest.fn().mockResolvedValueOnce(testSystemUser);

    // run tests
    expect(
      Utility.update(
        testResearchUser,
        testSystemUser._id as unknown as string,
        testSystemUser
      )
    ).rejects.toEqual(
      new Error({
        status: 403,
        message: "User is forbidden from updating this user.",
      })
    );
  });

  test("Researcher cannot update users", async () => {
    // mock function returns once
    User.findById = jest.fn().mockResolvedValueOnce(demoNewUser);

    // run tests
    expect(
      Utility.update(
        testResearchUser,
        demoNewUser._id as unknown as string,
        demoNewUser
      )
    ).rejects.toEqual(
      new Error({
        status: 403,
        message: "User is forbidden from updating this user.",
      })
    );
  });

  test("Annotator cannot update users", async () => {
    // mock function returns once
    User.findById = jest.fn().mockResolvedValueOnce(demoNewUser);

    // run tests
    expect(
      Utility.update(
        testAnnotatorUser,
        demoNewUser._id as unknown as string,
        demoNewUser
      )
    ).rejects.toEqual(
      new Error({
        status: 403,
        message: "User is forbidden from updating this user.",
      })
    );
  });
});

/**
 * @TODO Add test cases for (soft) deleting a user.
 */
