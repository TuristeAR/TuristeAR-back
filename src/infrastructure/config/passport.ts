import { PassportStatic, Profile} from 'passport';
import { Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth20';
import { CreateUserDto } from '../dtos/create-user.dto';
import { FindUserByGoogleIdUseCase } from '../../application/use-cases/user-use-cases/find-user-by.googleId.use-case';
import { CreateUserUseCase } from '../../application/use-cases/user-use-cases/create-user.use-case';
import { FindUserByIdUseCase } from '../../application/use-cases/user-use-cases/find-user-by.id.use-case';
import { request } from 'express';

export const initializePassport = (passport: PassportStatic) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        const findUserByGoogleIdUseCase = new FindUserByGoogleIdUseCase();

        let user = await findUserByGoogleIdUseCase.execute(profile.id);
        
        if (!user) {
          const createUserDto: CreateUserDto = {
            email: profile.emails![0].value,
            name: profile.displayName,
            profilePicture: profile.photos![0].value,
            googleId: profile.id,
            location: request.body.province,
          };

          const createUserUseCase = new CreateUserUseCase();

          user = await createUserUseCase.execute(createUserDto);
        }

        done(null, user);
      },
    ),
  );

  passport.serializeUser((user: any, done: (err: any, id?: any) => void) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done: (err: any, user?: any) => void) => {
    const findUserByIdUseCase = new FindUserByIdUseCase();

    const user = await findUserByIdUseCase.execute(id);

    done(null, user);
  });
};
