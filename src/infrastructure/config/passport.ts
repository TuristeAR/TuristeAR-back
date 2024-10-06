import { PassportStatic, Profile } from 'passport';
import { Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth20';
import { AppDataSource } from '../../data-source';
import { UserService } from '../../domain/services/user.service';
import { User } from '../../domain/entities/user';
import { CreateUserDto } from '../../application/dtos/create-user.dto';

export const initializePassport = (passport: PassportStatic) => {
  const userService = new UserService();

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        let user = await userService.findOneByGoogleId(profile.id);

        if (!user) {
          const createUserDto: CreateUserDto = {
            email: profile.emails![0].value,
            name: profile.displayName,
            profilePicture: profile.photos![0].value,
            googleId: profile.id,
          };

          user = await userService.create(createUserDto);
        }

        done(null, user);
      },
    ),
  );

  passport.serializeUser((user: any, done: (err: any, id?: any) => void) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done: (err: any, user?: any) => void) => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id });
    done(null, user);
  });
};
