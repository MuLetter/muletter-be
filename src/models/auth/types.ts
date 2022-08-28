import { Schema } from "mongoose";
import AuthModel from ".";
import bcrypt from "bcrypt";
import { authProjection } from "./projections";
import jwt from "jsonwebtoken";
import _ from "lodash";

export interface IAuth {
  _id?: Schema.Types.ObjectId | string;
  username: string;
  password: string;
  nickname: string;
  profile?: string;
  spotifyToken?: string;
  socketId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Auth implements IAuth {
  _id?: Schema.Types.ObjectId | string;
  username: string;
  _password: string;
  nickname: string;
  profile!: string;
  spotifyToken!: string;
  socketId!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(
    username: string,
    password: string,
    nickname: string,
    _id?: Schema.Types.ObjectId | string
  ) {
    this.username = username;
    this._password = password;
    this.nickname = nickname;
    this._id = _id;
  }

  static async check(username: string, password: string, nickname: string) {
    const check = await AuthModel.findOne({
      username,
    });

    if (check) throw new Error("이미 존재하는 계정입니다.");
    else return new Auth(username, password, nickname);
  }

  static async login(username: string, password: string) {
    const user = await AuthModel.findOne({ username }, authProjection);

    if (!user) throw new Error("존재하지 않는 계정입니다.");

    const { password: checkPassword } = user;
    const isAuth = await bcrypt.compare(password, checkPassword);

    if (!isAuth) throw new Error("패스워드가 올르지 않습니다.");
    return new Auth(
      user.username,
      user.password,
      user.nickname,
      user._id.toString()
    );
  }

  static async tokenCheck(token: string) {
    const secret = process.env.JWT_SECRET!;

    try {
      const auth = jwt.verify(token, secret!) as IAuth;
      return new Auth(auth.username, auth.password, auth.nickname, auth._id);
    } catch (err) {
      return undefined;
    }
  }

  get password() {
    return bcrypt.hashSync(this._password, 10);
  }

  get token() {
    const secret = process.env.JWT_SECRET!;
    const token = jwt.sign(_.toPlainObject(this), secret, {
      algorithm: "HS256",
      expiresIn: "1d",
    });

    return token;
  }

  async save() {
    const _auth: IAuth = {
      username: this.username,
      password: this.password,
      nickname: this.nickname,
    };

    const auth = await AuthModel.create(_auth);

    return auth;
  }
}
