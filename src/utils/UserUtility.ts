import { User, IUser, Utility, Error, Response, Types } from "@codrjs/models";
import { Abilities, Documents } from "@codrjs/mongo";
import Mongo from "./Mongo";

// define types
type Document = Documents.UserDocument;
type JwtPayload = Types.JwtPayload;

export class UserUtility extends Utility {
  private User;

  constructor() {
    super();
    this.User = Mongo.User.User;
  }

  // an internal method for getting the desired document to check against permissions
  protected async _getDocument<T>(id: string) {
    try {
      return (await this.User.findById(id)) as T;
    } catch (err) {
      console.log(err);
      throw new Error({
        status: 500,
        message: "Something went wrong when fetching user",
        details: {
          userId: id,
          error: err,
        },
      });
    }
  }

  private async _getDocumentByEmail<T>(email: string) {
    try {
      return (await this.User.findOne({ email })) as T;
    } catch (err) {
      throw new Error({
        status: 500,
        message: "Something went wrong when fetching user",
        details: {
          email,
          error: err,
        },
      });
    }
  }

  async get(token: JwtPayload, id: string) {
    // get desired user document
    const user = new User(await this._getDocument<Document>(id));

    // if user and read the document, send it, else throw error
    if (Abilities.UserAbility(token).can("read", user)) {
      return new Response({
        message: "OK",
        details: {
          user: new User(user),
        },
      });
    } else {
      throw new Error({
        status: 403,
        message: "User is forbidden from reading this user.",
      });
    }
  }

  /**
   * This method searches the database for a user by email address
   * @param email Email address of desired user
   * @returns response containing user object
   * @dangerous USE ONLY FOR ACCOUNT LOOKUP FOR AUTH SERVICE
   */
  async getByEmail(email: string) {
    // get desired user document
    return await this._getDocumentByEmail<Document>(email).then(user => {
      return new Response({
        message: "OK",
        details: {
          user: new User(user),
        },
      });
    });
  }

  async create(token: JwtPayload, obj: User) {
    // if user can create users
    if (Abilities.UserAbility(token).can("create", obj)) {
      try {
        // create user
        const user = await this.User.create(obj.toJSON());
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
        message: "User is forbidden from creating users.",
      });
    }
  }

  async update(token: JwtPayload, id: string, obj: Partial<IUser>) {
    // get desired user document
    const user = new User(await this._getDocument<Document>(id));

    // check permissions
    if (Abilities.UserAbility(token).can("update", user)) {
      try {
        // update user.
        const updatedUser = (await this.User.findByIdAndUpdate(id, obj, {
          returnDocument: "after",
        })) as Document;

        // return true if succeeded, else throw error
        return new Response({
          message: "OK",
          details: {
            user: new User(updatedUser),
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
        message: "User is forbidden from updating this user.",
      });
    }
  }

  /**
   * @todo Hard or soft delete users?
   */
  async delete(token: JwtPayload, id: string) {
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
