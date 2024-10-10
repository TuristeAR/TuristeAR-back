import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import session from 'express-session';
import status from 'http-status';
import passport from 'passport';
import { initializePassport } from '../infrastructure/config/passport';
import { AppDataSource } from '../infrastructure/database/data-source';
import { User } from '../domain/entities/user';
import { CreateWeatherDto } from './dtos/create-weather.dto';
import { WeatherService } from '../domain/services/weather.service';
import { CreateProvinceDto } from './dtos/create-province.dto';
import { ProvinceService } from '../domain/services/province.service';
import { PlaceService } from '../domain/services/place.service';
import { ReviewService } from '../domain/services/review.service';
import { CreateItineraryDto } from './dtos/create-itinerary.dto';
import { authMiddleware } from '../infrastructure/middlewares/auth.middleware';
import { ItineraryService } from '../domain/services/itinerary.service';
import { ActivityService } from '../domain/services/activity.service';
import { UserService } from '../domain/services/user.service';
import { PublicationService } from '../domain/services/publication.service';

dotenv.config();

const getCorsOrigins = () => {
  const corsOriginsString = process.env.CORS_ORIGINS || '';

  return corsOriginsString.split(',').map((origin) => origin.trim());
};

const app = express();

app.use(bodyParser.json());

app.use(cors({ credentials: true, origin: getCorsOrigins() }));

app.options('*', (req: Request, res: Response) => {
  res.set('Access-Control-Allow-Origin', req.headers.origin);
  res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(status.OK);
});

app.set('trust proxy', true);

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? '.koyeb.app' : 'localhost',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

initializePassport(passport);

app.use(passport.session());

app.use(passport.initialize());

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');

    app.listen(process.env.HTTP_PORT, () => {
      console.log(`Server running on port ${process.env.HTTP_PORT}`);
    });
  })
  .catch((error) => console.log('Data Source initialization error', error));

const weatherService = new WeatherService();
const provinceService = new ProvinceService();
const placeService = new PlaceService();
const publicationService = new PublicationService();
const reviewService = new ReviewService();
const itineraryService = new ItineraryService();
const activityService = new ActivityService();
const userService = new UserService();

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

app.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', (err: any, user: User) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login`);
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res.redirect(`${process.env.FRONTEND_URL}/login`);
      }

      res.redirect(`${process.env.FRONTEND_URL}`);
    });
  })(req, res, next);
});

app.get('/logout', authMiddleware, (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ status: 'error', message: 'Error logging out' });
    }

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect(`${process.env.FRONTEND_URL}`);
    });
  });
});

app.get('/session', (req: Request, res: Response) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.send({
      statusCode: status.OK,
      message: 'User is authenticated',
      user: req.user,
    });
  }

  return res.status(status.UNAUTHORIZED).send({
    statusCode: status.UNAUTHORIZED,
    message: 'User is not authenticated',
  });
});

app.post('/weather', async (req: Request, res: Response) => {
  try {
    const createWeatherDto: CreateWeatherDto = req.body;

    const weather = await weatherService.create(createWeatherDto);

    return res.status(status.CREATED).json({ statusCode: status.CREATED, data: weather });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error creating weather' });
  }
});

app.get('/weather', async (_req, res) => {
  try {
    const weather = await weatherService.findAll();

    return res.status(status.OK).json({ statusCode: status.OK, data: weather });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching weather' });
  }
});

app.post('/province', async (req: Request, res: Response) => {
  try {
    const createProvinceDto: CreateProvinceDto = req.body;

    const province = await provinceService.create(createProvinceDto);

    return res.status(status.CREATED).json({ statusCode: status.CREATED, data: province });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error creating province' });
  }
});

app.get('/province', async (_req, res) => {
  try {
    const provinces = await provinceService.findAll();

    return res.status(status.OK).json({ statusCode: status.OK, data: provinces });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching provinces' });
  }
});

app.get('/province/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const province = await provinceService.findOneById(Number(id));

    return res.status(status.OK).json({ statusCode: status.OK, data: province });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching province' });
  }
});

app.get('/place', async (_req, res) => {
  try {
    const places = await placeService.findAll();

    return res.status(status.OK).json({ statusCode: status.OK, data: places });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching places' });
  }
});

app.get('/place/:googleId', async (req: Request, res: Response) => {
  try {
    const { googleId } = req.params;

    const place = await placeService.findOneByGoogleId(googleId);

    return res.status(status.OK).json({ statusCode: status.OK, data: place });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching place' });
  }
});

app.get('/review', async (_req, res) => {
  try {
    const reviews = await reviewService.findAll();

    return res.status(status.OK).json({ statusCode: status.OK, data: reviews });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching reviews' });
  }
});

app.get('/review/:googleId', async (req: Request, res: Response) => {
  try {
    const { googleId } = req.params;

    const reviews = await reviewService.findOneByGoogleId(googleId);

    return res.status(status.OK).json({ statusCode: status.OK, data: reviews });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching reviews' });
  }
});

app.post('/formQuestion', authMiddleware, async (req: Request, res: Response) => {
  try {
    const createItineraryDto: CreateItineraryDto = req.body;

    const itinerary = await itineraryService.create(req.user as User, createItineraryDto);

    return res.status(status.CREATED).json({ statusCode: status.CREATED, data: itinerary });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error creating itinerary' });
  }
});

app.get('/itinerary/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const itinerary = await itineraryService.findOneById(Number(id));
    const activities = await itineraryService.findActivitiesById(Number(id));

    return res.status(status.OK).json({ statusCode: status.OK, data: { itinerary, activities } });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching itinerary' });
  }
});

app.get('/user-itineraries', authMiddleware, async (req: Request, res: Response) => {
  try {
    const itineraries = await itineraryService.findAllByUser(req.user as User);

    return res.status(status.OK).json({ statusCode: status.OK, data: itineraries });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching itineraries' });
  }
});

app.get('/user-all', (_req: Request, res: Response) => {
  try {
    const users = userService.findAll();

    return res.status(status.OK).json({ statusCode: status.OK, listUser: users });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error get all users' });
  }
});

app.get('/activity/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const activity = await activityService.findOneById(Number(id));

    return res.status(status.OK).json({ statusCode: status.OK, data: activity });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching activity' });
  }
});

app.get('/fetch-places', async (req: Request, res: Response) => {
  try {
    const province = (req.query.province as string) + ' Province';

    await placeService.fetchPlaces(province);

    return res.status(status.OK).json({ statusCode: status.OK, message: 'Places fetched' });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching places' });
  }
});

app.get('/fetch-reviews', async (_req, res) => {
  try {
    const places = await placeService.findAll();

    for (const place of places) {
      await reviewService.fetchReviews(place.googleId);
    }
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching reviews' });
  }
});

app.post('/itinerary/add-user', (req, res) => {
  const { itineraryId, participantId } = req.body;

  itineraryService
    .addUserToItinerary(itineraryId, participantId)
    .then((updatedItinerary) => {
      return res.status(200).json({ status: 'success', data: updatedItinerary });
    })
    .catch((error) => {
      console.error('Error adding user to itinerary:', error);
      return res.status(500).json({ status: 'error', message: 'Error adding user to itinerary' });
    });
});

app.delete('/itinerary/remove-user', (req, res) => {
  const { itineraryId, participantId } = req.body;

  itineraryService
    .removeUserFromItinerary(itineraryId, participantId)
    .then(() => {
      return res
        .status(200)
        .json({ status: 'success', message: `User with ID ${participantId} removed` });
    })
    .catch((error) => {
      console.error('Error removing user to itinerary:', error);
      return res.status(500).json({ status: 'error', message: 'Error removing user to itinerary' });
    });
});

app.get('/itinerary/paticipants/:itineraryId', (req, res) => {
  const { itineraryId } = req.params;
  if (!itineraryId) {
    return res.status(400).json({ status: 'error', message: 'itineraryId is required ' });
  }
  console.log('id', itineraryId);
  itineraryService
    .getItineraryWithParticipants(Number(itineraryId))
    .then((participants) => {
      return res.status(200).json({ status: 'success', participants });
    })
    .catch((error) => {
      console.error('Error get user to itinerary:', error);
      return res.status(500).json({ status: 'error', message: 'Error get user to itinerary' });
    });
});

app.post('/itinerary/add-activity', (req, res) => {
  const { itineraryId, activityId } = req.body;

  itineraryService
    .addActivityToItinerary(itineraryId, activityId)
    .then(() => {
      return res
        .status(200)
        .json({ status: 'success', message: `Activity with ID ${activityId} add` });
    })
    .catch((error) => {
      console.error('Error removing activity to itinerary:', error);
      return res.status(500).json({ status: 'error', message: 'Error add activity to itinerary' });
    });
});

app.delete('/itinerary/remove-activity', (req, res) => {
  const { itineraryId, activityId } = req.body;

  itineraryService
    .removeActivityFromItinerary(itineraryId, activityId)
    .then(() => {
      return res
        .status(200)
        .json({ status: 'success', message: `Activity with ID ${activityId} removed` });
    })
    .catch((error) => {
      console.error('Error removing activity to itinerary:', error);
      return res
        .status(500)
        .json({ status: 'error', message: 'Error removing activity to itinerary' });
    });
});

app.get('/users/search', async (req, res) => {
  const { name, offset = 0 } = req.query;

  try {
    const user = await userService.searchByName(name as string, offset as number);
    return res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    console.error('Error searching user:', error);
    return res.status(500).json({ status: 'error', message: 'Error searching user' });
  }
});

app.get('/provinces/:param/:count?', async (req: Request, res: Response) => {
  const { param, count = 4 } = req.params;
  const numericCount = Math.min(Number(count), 4);

  try {
    const province = await placeService.findManyByPlaceProvinceReviews(param, numericCount);

    if (!province) {
      return res.status(404).json({ message: 'Province not found' });
    }

    return res.json(province);
  } catch (error) {
    console.error('Error fetching province:', error);
    return res.status(500).json({ message: 'Error fetching province', error });
  }
});

app.get('/publications/:userID', async (req: Request, res: Response) => {
  const { userID } = req.params;

  try {
    let publications;

    if (!isNaN(Number(userID))) {
      publications = await publicationService.findForUser(Number(userID));
    }

    if (!publications || publications.length === 0) {
      return res.status(404).json({ message: 'No se encontraron publicaciones' });
    }

    return res.json(publications);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching publications', error });
  }
});

app.get('/publications', async (req: Request, res: Response) => {
  try {
    const publications = await publicationService.findAll({});

    return res.status(status.OK).json({ statusCode: status.OK, data: publications });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching publications' });
  }
});

app.get('/places/province?', async (req: Request, res: Response) => {
  const { provinceId, types, count = 4 } = req.query;

  try {
    const typesArray: string[] = Array.isArray(types)
      ? types.map((type) => String(type))
      : [String(types)];

    const places = await placeService.findPlaceByProvinceAndTypes(
      Number(provinceId),
      typesArray,
      Number(count),
    );

    return res.status(status.OK).json({ statusCode: status.OK, data: places });
  } catch (error) {
    console.error('Error fetching places:', error);
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching places' });
  }
});

export default app;
