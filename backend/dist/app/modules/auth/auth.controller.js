"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const user_model_1 = require("../user/user.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const config_1 = __importDefault(require("../../../config"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = __rest(req.body, []);
        const isExist = yield user_model_1.User.isUserExist(user.email);
        if (isExist) {
            throw new ApiError_1.default(400, 'user already exist');
        }
        const result = yield user_model_1.User.create(user);
        res.status(200).json({
            success: true,
            message: 'user created successfully!',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const isExist = yield user_model_1.User.isUserExist(email);
        if (!isExist) {
            throw new ApiError_1.default(404, 'user does not exist');
        }
        if (isExist.password &&
            !(yield user_model_1.User.isPasswordMatched(password, isExist.password))) {
            throw new ApiError_1.default(401, 'incorrect Password');
        }
        //create access token & refresh token
        const { _id: userId, email: userEmail } = isExist;
        const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId, userEmail }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
        const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId, userEmail }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
        // set refresh token into cookie
        const cookieOptions = {
            secure: config_1.default.env === 'production',
            httpOnly: true,
        };
        res.cookie('refreshToken', refreshToken, cookieOptions);
        res.status(200).json({
            success: true,
            message: 'user logged in successfully!',
            token: accessToken,
        });
    }
    catch (error) {
        next(error);
    }
});
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.cookies;
        let verifiedToken = null;
        try {
            verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(refreshToken, config_1.default.jwt.refresh_secret);
        }
        catch (err) {
            throw new ApiError_1.default(403, 'Invalid Refresh Token');
        }
        const { userId } = verifiedToken;
        const isExist = yield user_model_1.User.isUserExist(userId);
        if (!isExist) {
            throw new ApiError_1.default(404, 'user does not exist');
        }
        const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({
            _id: isExist._id,
            email: isExist.email,
        }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
        // set refresh token into cookie
        const cookieOptions = {
            secure: config_1.default.env === 'production',
            httpOnly: true,
        };
        res.cookie('refreshToken', refreshToken, cookieOptions);
        res.status(200).json({
            success: true,
            message: 'token create successfully!',
            token: newAccessToken,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.AuthController = {
    signUp,
    loginUser,
    refreshToken,
};
