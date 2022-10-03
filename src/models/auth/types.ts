import { Schema } from "mongoose";
import { AuthModel, OAuthMemoryModel } from ".";
import bcrypt from "bcrypt";
import { authProjection } from "./projections";
import jwt from "jsonwebtoken";
import { ResponseError } from "@routes/error";
import { StatusCodes } from "http-status-codes";
import { AuthFromToken } from "@routes/auth/types";
import { getTokenByCode, getUserMe } from "@api";
import { SpotifyToken, SpotifyUser } from "@api/types";

export interface IAuth {
  readonly id?: Schema.Types.ObjectId | string;

  _id?: Schema.Types.ObjectId | string;
  username: string;
  password: string;
  nickname: string;
  profile?: string;
  spotifyToken?: SpotifyToken;
  socketId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOAuthMemory {
  _id?: Schema.Types.ObjectId | string;

  state: string;
  data?: any;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateAuth {
  nickname?: string;
  profile?: string;
  spotifyToken?: string;
  socketId?: string;
}

export class Auth implements IAuth {
  readonly id?: Schema.Types.ObjectId | string;

  username: string;
  private _password: string;

  nickname: string;
  profile!: string;
  spotifyToken!: SpotifyToken;
  socketId?: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(
    username: string,
    password: string,
    nickname: string,
    _id?: Schema.Types.ObjectId | string,
    socketId?: string
  ) {
    this.username = username;
    this._password = password;
    this.nickname = nickname;
    this.id = _id;
    this.socketId = socketId;
  }

  toPlainObject() {
    const auth: AuthFromToken = {
      id: this.id! as string,
      username: this.username,
      nickname: this.nickname,
    };
    if (this.spotifyToken) auth.spotifyToken = this.spotifyToken;
    if (this.socketId) auth.socketId = this.socketId;

    return auth;
  }

  static async check(username: string, password: string, nickname: string) {
    const check = await AuthModel.findOne({
      username,
    });

    if (check)
      throw new ResponseError(
        StatusCodes.UNAUTHORIZED,
        "이미 존재하는 계정입니다."
      );
    else return new Auth(username, password, nickname);
  }

  static async login(username: string, password: string) {
    const user = await AuthModel.findOne({ username }, authProjection);

    if (!user)
      throw new ResponseError(
        StatusCodes.UNAUTHORIZED,
        "존재하지 않는 계정입니다."
      );

    const { password: checkPassword } = user;
    const isAuth = await bcrypt.compare(password, checkPassword);

    if (!isAuth)
      throw new ResponseError(
        StatusCodes.UNAUTHORIZED,
        "패스워드가 올바르지 않습니다."
      );
    return new Auth(
      user.username,
      user.password,
      user.nickname,
      user._id.toString()
    );
  }

  static async tokenCheck(token?: string) {
    const secret = process.env.JWT_SECRET!;

    if (!token)
      throw new ResponseError(
        StatusCodes.UNAUTHORIZED,
        "토큰이 발행되지 않았습니다."
      );

    try {
      const auth = jwt.verify(token, secret!) as IAuth;
      const dbCheck = await AuthModel.findOne({ username: auth.username });

      console.log("tokenCheck", dbCheck);

      if (!dbCheck) throw new Error();

      return new Auth(
        dbCheck.username,
        dbCheck.password,
        dbCheck.nickname,
        dbCheck.id,
        dbCheck.socketId
      );
    } catch (err) {
      throw new ResponseError(
        StatusCodes.FORBIDDEN,
        "유효하지 않은 토큰 입니다."
      );
    }
  }

  static async getById(id: Schema.Types.ObjectId | string) {
    const user = await AuthModel.findById(id, authProjection);

    if (!user)
      throw new ResponseError(
        StatusCodes.UNAUTHORIZED,
        "존재하지 않는 계정입니다."
      );
    const auth = new Auth(
      user.username,
      user.password,
      user.nickname,
      user._id.toString()
    );
    if (user.socketId) auth.socketId = user.socketId;

    return auth;
  }

  set password(password: string) {
    this._password = password;
  }

  get password() {
    return bcrypt.hashSync(this._password, 10);
  }

  get token() {
    const secret = process.env.JWT_SECRET!;
    const token = jwt.sign(this.toPlainObject(), secret, {
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
      spotifyToken: this.spotifyToken,
    };

    const auth = await AuthModel.create(_auth);

    return auth;
  }

  async update(update: UpdateAuth) {
    await AuthModel.updateOne({ _id: this.id }, update);
    const updateAuth = await AuthModel.findById(this.id);

    if (updateAuth)
      return new Auth(
        updateAuth?.username,
        updateAuth?.password,
        updateAuth.nickname,
        updateAuth?._id,
        updateAuth.socketId
      );

    return;
  }
}

export class OAuthMemory implements IOAuthMemory {
  state: string;
  data?: any;

  constructor(state: string, data?: any) {
    this.state = state;
    this.data = data;
  }

  static async create(state: string) {
    const oauthMemory = await OAuthMemoryModel.create({
      state,
    });

    return new OAuthMemory(oauthMemory.state);
  }

  static async get(state: string) {
    const OAuthMemoryDocs = await OAuthMemoryModel.findOne({ state });

    if (!OAuthMemoryDocs)
      throw new ResponseError(
        StatusCodes.BAD_REQUEST,
        "존재하지 않는 정보 입니다."
      );

    return new OAuthMemory(OAuthMemoryDocs.state, OAuthMemoryDocs.data);
  }

  async save(data: any) {
    const memory = await OAuthMemoryModel.findOneAndUpdate(
      { state: this.state },
      { $set: { data: data } },
      { new: true }
    );
    this.data = memory!.data;
  }

  async getToken(code: string) {
    const res = await getTokenByCode(code);

    return res.data;
  }

  async getProfile(accessToken: string) {
    const res = await getUserMe(accessToken);

    return res.data;
  }
}
