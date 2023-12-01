import { NextFunction, Request, Response } from 'express';
import { User } from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { Secret } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ...user } = req.body;

    const isExist = await User.isUserExist(user.email);

    if (isExist) {
      throw new ApiError(400, 'user already exist');
    }

    const hashPassword = await bcrypt.hash(
      user?.password,
      Number(config.bycrypt_salt_rounds)
    );

    user.password = hashPassword;

    const result = await User.create(user);

    res.status(200).json({
      success: true,
      message: 'user created successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const isExist = await User.isUserExist(email);

    if (!isExist) {
      throw new ApiError(404, 'user does not exist');
    }

    if (!isExist.password) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Password is missing'
      );
    }

    const decriptedPassword = await bcrypt.compare(password, isExist.password);

    if (isExist?.password && !decriptedPassword) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect Password');
    }

    //create access token & refresh token

    const { _id: userId, email: userEmail } = isExist;

    const accessToken = jwtHelpers.createToken(
      { userId, userEmail },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );

    const refreshToken = jwtHelpers.createToken(
      { userId, userEmail },
      config.jwt.refresh_secret as Secret,
      config.jwt.refresh_expires_in as string
    );

    // set refresh token into cookie

    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.status(200).json({
      success: true,
      message: 'user logged in successfully!',
      token: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.cookies;

    let verifiedToken = null;
    try {
      verifiedToken = jwtHelpers.verifyToken(
        refreshToken,
        config.jwt.refresh_secret as Secret
      );
    } catch (err) {
      throw new ApiError(403, 'Invalid Refresh Token');
    }

    const { userId } = verifiedToken;

    const isExist = await User.isUserExist(userId);
    if (!isExist) {
      throw new ApiError(404, 'user does not exist');
    }

    const newAccessToken = jwtHelpers.createToken(
      {
        _id: isExist._id,
        email: isExist.email,
      },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );

    // set refresh token into cookie

    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.status(200).json({
      success: true,
      message: 'token create successfully!',
      token: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const AuthController = {
  signUp,
  loginUser,
  refreshToken,
};
