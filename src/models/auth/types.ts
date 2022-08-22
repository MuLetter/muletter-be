import { Schema } from "mongoose";
import AuthModel from ".";
import bcrypt from "bcrypt";

export interface IAuth {
  _id?: Schema.Types.ObjectId;
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
  _id!: Schema.Types.ObjectId;
  username: string;
  _password: string;
  nickname: string;
  profile!: string;
  spotifyToken!: string;
  socketId!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(username: string, password: string, nickname: string) {
    this.username = username;
    this._password = password;
    this.nickname = nickname;
  }

  static async get(username: string, password: string, nickname: string) {
    const check = await AuthModel.findOne({
      username,
    });

    if (check) throw new Error("이미 존재하는 계정입니다.");
    else return new Auth(username, password, nickname);
  }

  get password() {
    return bcrypt.hashSync(this._password, 10);
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