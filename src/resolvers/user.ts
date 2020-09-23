import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { MyContext } from "src/MyContext";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { User } from "../entities/User";
import { createRefreshToken } from "./auth";
import { isAuth } from "./isAuth";
import { sendRefreshToken } from "./sendRefreshToken";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@InputType()
export class UserInput {
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  @UseMiddleware(isAuth)
  async me(@Ctx() { payload }: MyContext) {
    return await `your user id is: ${payload!.userId}`;
  }

  @Query(() => [User])
  async getUsers() {
    return await User.find();
  }

  @Query(() => User)
  async getAUser(@Arg("id") id: number) {
    return await User.findOne({ where: { id } });
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);

    return true;
  }

  // @Mutation(() => Boolean)
  // async logout(@Ctx() { res }: MyContext) {
  //   sendRefreshToken(res, "");

  //   return true;
  // }

  @Mutation(() => Boolean)
  async signUp(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const hashedPassword = await hash(password, 12);

    try {
      await User.insert({
        name,
        email,
        password: hashedPassword,
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("could not find user");
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("wrong password");
    }

    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: "15m",
      }),
    };
  }

  @Mutation(() => User)
  async updateUser(@Arg("id") id: number, @Arg("data") data: UserInput) {
    const user = await User.findOne({ where: { id } });
    if (!user) throw new Error("User not found!");
    Object.assign(user, data);
    await user.save();
    return user;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg("id") id: number) {
    const user = await User.findOne({ where: { id } });
    if (!user) throw new Error("User not found!");
    await user.remove();
    return true;
  }
}
