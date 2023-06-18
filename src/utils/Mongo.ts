// import MongoLogger from "@/server/mongo/utils/logger";
// import { Types, User } from "@codrjs/models";
import { MongoManager, Types as MongoTypes } from "@codrjs/mongo";
// import { Types as MongooseTypes } from "mongoose";

// const log = MongoLogger;

const Mongo = new MongoManager([
  {
    name: MongoTypes.DatabaseEnum.USER,
    models: [MongoTypes.UserModelEnum.USER],
  },
]);

// Mongo.User.on("open", async () => {
//   log.debug("Checking for system user.");

//   if (
//     (await Mongo.User.User.findOne({
//       type: Types.UserEnum.SYSTEM,
//       email: "system@codrjs.com",
//       role: Types.UserRoleEnum.SYSTEM,
//     })) == null
//   ) {
//     log.debug("No system user found!");

//     const systemUserId = new MongooseTypes.ObjectId();
//     const systemUser = new User({
//       _id: systemUserId,
//       type: Types.UserEnum.SYSTEM,
//       email: "system@codrjs.com",
//       role: Types.UserRoleEnum.SYSTEM,
//       flags: {
//         isAnonymous: false,
//         isDeleted: false,
//         isDisabled: false,
//       },
//       createdBy: systemUserId,
//       updatedBy: systemUserId,
//     });

//     const user = new Mongo.User.User(systemUser.toJSON());
//     log.debug("Creating system user.");
//     log.debug(JSON.stringify(user.toJSON()));

//     user.save((error, result) => {
//       if (error) {
//         log.error("Failed to create system user!");
//         log.error(error.message);
//         throw new Error("Failed to create system user.");
//       } else {
//         log.debug("System user was successfully created!");
//       }
//     });

//     // create a profile for the system user.
//   } else {
//     log.debug("System user exists. Continuting operations.");
//   }
// });

export default Mongo;
