import { User, IUser, Utility, Error, Response } from "@codrjs/models";
import MongoUser, { UserDocument } from "../mongo/User";
import UserAbility from "../mongo/User.ability";

export class UserUtility extends Utility {
  // an internal method for getting the desired document to check against permissions
  protected async _getDocument<T>(id: string) {
    return (await MongoUser.findById(id)) as T;
  }

  async get(token: IUser, id: string) {
    // get desired user document
    const user = await this._getDocument<UserDocument>(id);

    // if user and read the document, send it, else throw error
    if (UserAbility(token).can("read", user)) {
      return new Response({
        message: "OK",
        details: {
          user: new User(user),
        },
      });
    } else {
      throw new Error({
        status: 403,
        message: "You are forbidden from reading this user.",
      });
    }
  }

  async create(token: IUser, obj: IUser) {
    // if user can create users
    if (UserAbility(token).can("create", "User")) {
      try {
        // create user
        const user = await MongoUser.create(obj);
        return new Response({
          message: "OK",
          details: {
            user: new User(user),
          },
        });
      } catch (e) {
        throw new Error({
          status: 500,
          message: "An unexpected error occurred when trying to create a user.",
          details: e,
        });
      }
    } else {
      throw new Error({
        status: 403,
        message: "You are forbidden from creating users.",
      });
    }
  }

  async update(token: IUser, id: string, obj: Partial<IUser>) {
    // get desired user document
    const user = await this._getDocument<UserDocument>(id);

    // check permissions
    if (UserAbility(token).can("update", user)) {
      try {
        // update user.
        const user = (await MongoUser.findByIdAndUpdate(id, obj, {
          returnDocument: "after",
        })) as UserDocument;

        // return true if succeeded, else throw error
        return new Response({
          message: "OK",
          details: {
            user: new User(user),
          },
        });
      } catch (e) {
        throw new Error({
          status: 500,
          message: "An unexpected error occurred when trying to update a user.",
          details: e,
        });
      }
    } else {
      throw new Error({
        status: 403,
        message: "You are forbidden from updating this user.",
      });
    }
  }

  /**
   * @todo Hard or soft delete users?
   */
  async delete(token: IUser, id: string) {
    throw new Error({
      status: 500,
      message: "Method not implemented.",
    });

    // expected return???
    return new Response({
      message: "OK",
      details: {
        user: undefined,
      },
    });
  }
}
