import { Types as CodrTypes, User, Error } from "@codrjs/models";
import jwt from "jsonwebtoken";
import { UserUtility } from "@/utils/UserUtility";
import { Types } from "mongoose";
import Mongo from "@/utils/Mongo";
import { Documents } from "@codrjs/mongo";
import Config from "@codrjs/config";

const UserEnum = CodrTypes.UserEnum;
const UserRoleEnum = CodrTypes.UserRoleEnum;

const generateUser = (
  type: CodrTypes.UserEnum,
  role: CodrTypes.UserRoleEnum,
  createdBy: Types.ObjectId
): User => {
  const userId = new Types.ObjectId();
  return new User({
    _id: userId,
    email: `demouser+${userId}@codrjs.com`,
    role,
    type,
    flags: {
      isDeleted: false,
      isDisabled: false,
      isAnonymous: true,
    },
    createdBy,
  });
};

const generateUserJwt = (user: User) => {
  return jwt.decode(
    jwt.sign(user.toJSON(), Config.jwt.secret, {
      issuer: Config.jwt.issuer,
      algorithm: <jwt.Algorithm>Config.jwt.algorithm,
      subject: user._id.toString(),
      expiresIn: "1h",
      jwtid: new Types.ObjectId().toString(),
    })
  ) as CodrTypes.JwtPayload;
};

describe("User Utility", () => {
  let Utility: UserUtility;
  let SystemUser: {
    Class: User;
    Payload: CodrTypes.JwtPayload;
  };
  let AdminUser: {
    Class: User;
    Payload: CodrTypes.JwtPayload;
  };
  let ResearchUser: {
    Class: User;
    Payload: CodrTypes.JwtPayload;
  };
  let AnnotatorUser: {
    Class: User;
    Payload: CodrTypes.JwtPayload;
  };

  beforeAll(async () => {
    // connect to mongo
    await Mongo.connect();

    const MongoUser = Mongo.User.User;
    Utility = new UserUtility();

    // get user document
    const Class = new User(
      (await MongoUser.findOne({
        email: "system@codrjs.com",
      })) as Documents.UserDocument
    );

    SystemUser = {
      Class,
      Payload: generateUserJwt(Class),
    };

    const annotator = generateUser(
      UserEnum.ANONYMOUS,
      UserRoleEnum.ANNOTATOR,
      SystemUser.Class._id
    );

    AnnotatorUser = {
      Class: annotator,
      Payload: generateUserJwt(annotator),
    };
  });

  afterAll(async () => {
    await Mongo.close();
  });

  describe("Create: User", () => {
    test("System can add user", async () => {
      // generate data
      const newUser = generateUser(
        UserEnum.MEMBER,
        UserRoleEnum.ADMIN,
        new Types.ObjectId(SystemUser.Payload.sub)
      );

      // run tests
      const user = await Utility.create(SystemUser.Payload, newUser);

      // set data
      AdminUser = {
        Class: user.details.user,
        Payload: generateUserJwt(user.details.user),
      };

      expect(user.details.user.email).toBe(newUser.email);
    });

    test("System cannot add a system user", async () => {
      const newUser = generateUser(
        UserEnum.SYSTEM,
        UserRoleEnum.SYSTEM,
        new Types.ObjectId(SystemUser.Payload.sub)
      );

      // run tests
      expect(Utility.create(SystemUser.Payload, newUser)).rejects.toEqual(
        new Error({
          status: 403,
          message: "User is forbidden from creating users.",
        })
      );
    });

    test("Admin can add user", async () => {
      // generate data
      const newUser = generateUser(
        UserEnum.MEMBER,
        UserRoleEnum.RESEARCHER,
        new Types.ObjectId(AdminUser.Payload.sub)
      );

      // run tests
      const user = await Utility.create(AdminUser.Payload, newUser);

      // set data
      ResearchUser = {
        Class: user.details.user,
        Payload: generateUserJwt(user.details.user),
      };

      expect(user.details.user.email).toBe(newUser.email);
    });

    test("Admin cannot add a system user", async () => {
      const newUser = generateUser(
        UserEnum.SYSTEM,
        UserRoleEnum.SYSTEM,
        new Types.ObjectId(AdminUser.Payload.sub)
      );

      // run tests
      expect(Utility.create(AdminUser.Payload, newUser)).rejects.toEqual(
        new Error({
          status: 403,
          message: "User is forbidden from creating users.",
        })
      );
    });

    test("Researcher cannot add user", async () => {
      const newUser = generateUser(
        UserEnum.MEMBER,
        UserRoleEnum.ANNOTATOR,
        new Types.ObjectId(ResearchUser.Payload.sub)
      );

      // run tests
      expect(Utility.create(ResearchUser.Payload, newUser)).rejects.toEqual(
        new Error({
          status: 403,
          message: "User is forbidden from creating users.",
        })
      );
    });

    test("Annotator cannot add user", () => {
      const newUser = generateUser(
        UserEnum.MEMBER,
        UserRoleEnum.ANNOTATOR,
        new Types.ObjectId(AnnotatorUser.Payload.sub)
      );

      // run tests
      expect(Utility.create(AnnotatorUser.Payload, newUser)).rejects.toEqual(
        new Error({
          status: 403,
          message: "User is forbidden from creating users.",
        })
      );
    });
  });

  describe("Read: User", () => {
    test("System can read another user", async () => {
      // run tests
      const user = await Utility.get(
        SystemUser.Payload,
        ResearchUser.Payload.sub
      );
      expect(user.details.user.email).toBe(ResearchUser.Class.email);
    });

    test("Admin can read another user", async () => {
      // run tests
      const user = await Utility.get(
        AdminUser.Payload,
        ResearchUser.Payload.sub
      );
      expect(user.details.user.email).toBe(ResearchUser.Class.email);
    });

    test("Researcher cannot read another user", async () => {
      // run tests
      await new Promise((resolve, reject) => {
        expect(Utility.get(ResearchUser.Payload, AdminUser.Payload.sub))
          .rejects.toEqual(
            new Error({
              status: 403,
              message: "User is forbidden from reading this user.",
            })
          )
          .then(resolve)
          .catch(reject);
      });
    });

    test("Annotator cannot read another user", async () => {
      // run tests
      await new Promise((resolve, reject) => {
        expect(Utility.get(AnnotatorUser.Payload, AdminUser.Payload.sub))
          .rejects.toEqual(
            new Error({
              status: 403,
              message: "User is forbidden from reading this user.",
            })
          )
          .then(resolve)
          .catch(reject);
      });
    });

    test("Researcher can read their own user", async () => {
      // run tests
      const user = await Utility.get(
        ResearchUser.Payload,
        ResearchUser.Payload.sub
      );
      expect(user.details.user.email).toBe(ResearchUser.Class.email);
    });

    // test("Annotator can read their own user", async () => {
    //   // run tests
    //   const user = await Utility.get(
    //     AnnotatorUser.Payload,
    //     AnnotatorUser.Payload.sub
    //   );
    //   expect(user.details.user.email).toBe(AnnotatorUser.Class.email);
    // });
  });

  describe("Update: User", () => {
    test("System can update another user", async () => {
      // run tests
      const user = await Utility.update(
        SystemUser.Payload,
        AdminUser.Class._id.toString(),
        AdminUser.Class
      );
      expect(user.details.user.updatedAt.getTime()).toBeGreaterThan(
        AdminUser.Class.updatedAt.getTime()
      );
    });

    test("Admin can update another user", async () => {
      // run tests
      const user = await Utility.update(
        AdminUser.Payload,
        ResearchUser.Class._id.toString(),
        ResearchUser.Class
      );
      expect(user.details.user.updatedAt.getTime()).toBeGreaterThan(
        ResearchUser.Class.updatedAt.getTime()
      );
    });

    test("System cannot update system user", async () => {
      // run tests
      await new Promise((resolve, reject) => {
        expect(
          Utility.update(
            SystemUser.Payload,
            SystemUser.Payload.sub,
            SystemUser.Class
          )
        )
          .rejects.toEqual(
            new Error({
              status: 403,
              message: "User is forbidden from updating this user.",
            })
          )
          .then(resolve)
          .catch(reject);
      });
    });

    test("Admin cannot update system user", async () => {
      // run tests
      await new Promise((resolve, reject) => {
        expect(
          Utility.update(
            AdminUser.Payload,
            SystemUser.Payload.sub,
            SystemUser.Class
          )
        )
          .rejects.toEqual(
            new Error({
              status: 403,
              message: "User is forbidden from updating this user.",
            })
          )
          .then(resolve)
          .catch(reject);
      });
    });

    test("Researcher cannot update users", async () => {
      // run tests
      await new Promise((resolve, reject) => {
        expect(
          Utility.update(
            ResearchUser.Payload,
            ResearchUser.Payload.sub,
            ResearchUser.Class
          )
        )
          .rejects.toEqual(
            new Error({
              status: 403,
              message: "User is forbidden from updating this user.",
            })
          )
          .then(resolve)
          .catch(reject);
      });

      // test("Annotator cannot update users", async () => {
      //   // mock function returns once
      //   User.findById = jest.fn().mockResolvedValueOnce(demoNewUser);

      //   // run tests
      //   expect(
      //     Utility.update(
      //       testAnnotatorUser,
      //       (demoNewUser._id as Types.ObjectId).toString(),
      //       demoNewUser
      //     )
      //   ).rejects.toEqual(
      //     new Error({
      //       status: 403,
      //       message: "User is forbidden from updating this user.",
      //     })
      //   );
      // });
    });
  });
});

/**
 * @TODO Add test cases for (soft) deleting a user.
 */
