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
import { Itinerary } from '../domain/entities/itinerary';
import { CategoryService } from '../domain/services/category.service';
import { Publication } from '../domain/entities/publication';
import { CreatePublicationDTO } from './dtos/create-publication.dto';

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
const categoryService = new CategoryService();
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

app.get('/fetch-activities-places/:province', async (req: Request, res: Response) => {
  const provinceName = req.params.province;

  try {
    const places = await placeService.fetchPlacesByProvince(provinceName);
    res.json({
      status: 'success',
      data: places,
    });
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(404).json({
      status: 'error',
      message: 'An error occurred.',
    });
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

app.post('/itinerary/add-user', authMiddleware, (req, res) => {
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

app.delete('/itinerary/remove-user', authMiddleware, async (req, res) => {
  const { itineraryId, participantId } = req.body;
  //validation in the service
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

app.get('/itinerary/participants/:itineraryId', authMiddleware, async (req, res) => {
  const { itineraryId } = req.params;
  const userSession = req.user as User;

  console.log('User session:', userSession);

  if (!itineraryId) {
    return res.status(400).json({ status: 'error', message: 'itineraryId is required' });
  }

  try {
    const itineraryParticipants = await itineraryService.getItineraryWithParticipants(
      Number(itineraryId),
    );
    Number(itineraryId);

    if (!itineraryParticipants) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    const isParticipant = itineraryParticipants.participants.some(
      (participant) => participant.id === userSession.id,
    );
    const isOwner = itineraryParticipants.user.id === userSession.id;

    if (!isParticipant && !isOwner) {
      return res.status(403).json({ error: 'You are not authorized to access this itinerary.' });
    }

    return res.status(200).json({ status: 'success', itineraryParticipants });
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    return res.status(500).json({ status: 'error', message: 'Error fetching itinerary' });
  }
});

app.post('/itinerary/add-activity', (req, res) => {
  const { itineraryId, createActivityDto } = req.body;

  itineraryService
    .addActivityToItinerary(itineraryId, createActivityDto)
    .then((itinerary) => {
      return res
        .status(200)
        .json({ status: 'success', message: `Activity added to itinerary`, itinerary });
    })
    .catch((error) => {
      console.error('Error adding activity to itinerary:', error);
      return res
        .status(500)
        .json({ status: 'error', message: 'Error adding activity to itinerary' });
    });
});

app.delete('/itinerary/remove-activity', async (req, res) => {
  const { itineraryId, activityId } = req.body;

  try {
    await itineraryService.removeActivityFromItinerary(itineraryId, activityId);
    return res
      .status(200)
      .json({ status: 'success', message: `Activity with ID ${activityId} removed` });
  } catch (error) {
    console.error('Error removing activity from itinerary:');
    return res.status(500).json({ status: 'error' });
  }
});

app.get('/itinerary/byUser/:userId', (req, res) => {
  const { userId } = req.params;
  itineraryService
    .getItinerariesWithParticipantsAndUserByUserId(Number(userId))
    .then((participants) => {
      return res.status(200).json({ status: 'success', participants });
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ status: 'error', message: 'Error getting itineraries' + error });
    });
});

app.get('/users/search', authMiddleware, async (req, res) => {
  const { name, offset = 0, itineraryId } = req.query;

  try {
    let excludedIds: number[] = [];

    if (itineraryId) {
      const itinerary = await itineraryService.getItineraryWithParticipants(Number(itineraryId));

      if (itinerary && Array.isArray(itinerary.participants)) {
        excludedIds = itinerary.participants.map((participant: User) => participant.id);
        excludedIds.push(itinerary.user.id);
      }
    }

    const users = await userService.searchByName(name as string, offset as number);

    if (!Array.isArray(users)) {
      return res.status(500).json({ status: 'error', message: 'Unexpected users format' });
    }

    const filteredUsers = users.filter((user) => !excludedIds.includes(user.id));
    return res.status(200).json({ status: 'success', data: filteredUsers });
  } catch (error) {
    console.error('Error searching user:', error);
    return res.status(500).json({ status: 'error', message: 'Error searching user' });
  }
});

app.get('/provinces/:param/:count?', async (req: Request, res: Response) => {
  const { param, count = 10 } = req.params;
  const numericCount = Math.min(Number(count), 10);

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

app.get('/publications/:userID', async (req: Request, res: Response) => {
  const { userID } = req.params;

  try {
    let publications;

    if (!isNaN(Number(userID))) {
      publications = await publicationService.findByUser(Number(userID));
    }

    if (!publications) {
      return res.status(404).json({ message: 'No se encontraron publicaciones' });
    }

    return res.json(publications);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching publications', error });
  }
});

app.get('/publications/likes/:userID', async (req: Request, res: Response) => {
  const { userID } = req.params;

  try {
    let publications;

    if (!isNaN(Number(userID))) {
      publications = await publicationService.findByLikesUser(Number(userID));
    }

    if (!publications) {
      return res.status(404).json({ message: 'No se encontraron publicaciones' });
    }

    return res.json(publications);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching publications', error });
  }
});

app.get('/publications/saved/:userID', async (req: Request, res: Response) => {
  const { userID } = req.params;

  try {
    let publications;

    if (!isNaN(Number(userID))) {
      publications = await publicationService.findBySavedUser(Number(userID));
    }

    if (!publications) {
      return res.status(404).json({ message: 'No se encontraron publicaciones' });
    }

    return res.json(publications);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching publications', error });
  }
});

app.get('/publications/categories/:categoryId', async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  try {
    let publications;

    if (!isNaN(Number(categoryId))) {
      publications = await publicationService.findByCategory(Number(categoryId));
    }

    if (!publications) {
      return res.status(404).json({ message: 'No se encontraron publicaciones' });
    }

    return res.json(publications);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching publications', error });
  }
});

app.get('/categories', async (req: Request, res: Response) => {
  try {
    let categories = await categoryService.findAll();

    if (!categories) {
      return res.status(404).json({ message: 'No se encontraron las categorias' });
    }

    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching categories', error });
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

app.get('/reviews/place/:idGoogle', async (req: Request, res: Response) => {
  const { idGoogle } = req.params;

  try {
    const reviews = await reviewService.findReviewsByPlaceId(idGoogle);

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this place' });
    }

    const response = reviews;

    return res.json(response);
  } catch (error) {
    console.error('Error fetching reviews and place:', error);
    return res.status(500).json({ message: 'Error fetching reviews and place', error });
  }
});

app.get('/place/:idGoogle', async (req: Request, res: Response) => {
  const { idGoogle } = req.params;

  try {
    const place = await placeService.findOneByGoogleId(idGoogle);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    const response = place;

    return res.json(response);
  } catch (error) {
    console.error('Error fetching place:', error);
    return res.status(500).json({ message: 'Error fetching place', error });
  }
});

app.put('/editProfile/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { description, location, birthdate } = req.body;

  try {
    let user = await userService.findOneById(Number(userId));

    if (!user) {
      return res.status(404).json({ message: 'No se encontró al usuario' });
    }

    user.description = description || user.description;
    user.location = location || user.location;
    user.birthdate = birthdate ? new Date(birthdate) : user.birthdate;

    await userService.save(user);

    return res.json({ message: 'Datos modificados correctamente', user });
  } catch (error) {
    return res.status(500).json({ message: 'Error al modificar los datos', error });
  }
});

app.post('/createPublication', async (req: Request, res: Response) => {
  try {
    const createPublicationDTO: CreatePublicationDTO = req.body;

    const publication = await publicationService.createPublication(createPublicationDTO);

    return res.status(status.CREATED).json({ statusCode: status.CREATED, data: publication });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error creating province' });
  }
});

export default app;
