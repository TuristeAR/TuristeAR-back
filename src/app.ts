import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import session from 'express-session';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import status from 'http-status';
import passport from 'passport';
import { initializePassport } from './infrastructure/config/passport';
import { AppDataSource } from './infrastructure/database/data-source';
import { User } from './domain/entities/user';
import { CreateWeatherDto } from './infrastructure/dtos/create-weather.dto';
import { CreateProvinceDto } from './infrastructure/dtos/create-province.dto';
import { PlaceService } from './domain/services/place.service';
import { ReviewService } from './domain/services/review.service';
import { CreateItineraryDto } from './infrastructure/dtos/create-itinerary.dto';
import { authMiddleware } from './infrastructure/middlewares/auth.middleware';
import { ItineraryService } from './domain/services/itinerary.service';
import { PublicationService } from './domain/services/publication.service';
import { CreatePublicationDTO } from './infrastructure/dtos/create-publication.dto';
import { CreateEventDTO } from './infrastructure/dtos/create-event.dto';
import { FindActivityByIdUseCase } from './application/use-cases/activity-use-cases/find-activity-by-id.use-case';
import { FindAllCategoryUseCase } from './application/use-cases/category-use-cases/find-all-category.use-case';
import { CreateWeatherUseCase } from './application/use-cases/weather-use-cases/create-weather.use-case';
import { FindAllWeatherUseCase } from './application/use-cases/weather-use-cases/find-all-weather.use-case';
import { FindAllUserUseCase } from './application/use-cases/user-use-cases/find-all-user.use-case';
import { FindUserByNameUseCase } from './application/use-cases/user-use-cases/find-user-by-name.use-case';
import { FindUserByIdUseCase } from './application/use-cases/user-use-cases/find-user-by.id.use-case';
import { UpdateUserUseCase } from './application/use-cases/user-use-cases/update-user.use-case';
import { FindAllReviewUseCase } from './application/use-cases/review-use-cases/find-all-review.use-case';
import { FindReviewByGoogleIdUseCase } from './application/use-cases/review-use-cases/find-review-by-googleId.use-case';
import { FindReviewByPlaceIdUseCase } from './application/use-cases/review-use-cases/find-review-by-placeId.use-case';
import { CreateProvinceUseCase } from './application/use-cases/province-use-cases/create-province.use-case';
import { FindAllProvinceUseCase } from './application/use-cases/province-use-cases/find-all-province.use-case';
import { FindProvinceByIdUseCase } from './application/use-cases/province-use-cases/find-province-by-id.use-case';
import { FindAllPublicationUseCase } from './application/use-cases/publication-use-cases/find-all-publication.use-case';
import { FindPublicationByUserUseCase } from './application/use-cases/publication-use-cases/find-publication-by-user.use-case';
import { FindPublicationByUserLikesUseCase } from './application/use-cases/publication-use-cases/find-publication-by-user-likes.use-case';
import { FindPublicationByUserSavedUseCase } from './application/use-cases/publication-use-cases/find-publication-by-user-saved.use-case';
import { FindPublicationByCategoryUseCase } from './application/use-cases/publication-use-cases/find-publication-by-category.use-case';
import { FindPublicationByIdUseCase } from './application/use-cases/publication-use-cases/find-publication-by-id.use-case';
import { FindProvinceByNameUseCase } from './application/use-cases/province-use-cases/find-province-by-name.use-case';
import { FindPlaceByProvinceUseCase } from './application/use-cases/place-use-cases/find-place-by-province.use-case';
import { FindAllPlaceUseCase } from './application/use-cases/place-use-cases/find-all-place.use-case';
import { FindPlaceByGoogleIdUseCase } from './application/use-cases/place-use-cases/find-place-by-googleId.use-case';
import { FindItineraryByIdUseCase } from './application/use-cases/itinerary-use-cases/find-itinerary-by-id.use-case';
import { FindItineraryByUserUseCase } from './application/use-cases/itinerary-use-cases/find-itinerary-by-user.use-case';
import { FindItineraryWithParticipantsUseCase } from './application/use-cases/itinerary-use-cases/find-itinerary-with-participants.use-case';
import { FindItineraryByUserWithParticipantsUseCase } from './application/use-cases/itinerary-use-cases/find-itinerary-by-user-with-participants.use-case';
import { Message } from './domain/entities/message';
import { CreateMessageUseCase } from './application/use-cases/message-use-cases/create-message.use-case';
import { FindAllForumUseCase } from './application/use-cases/forum-use-cases/find-all-forum.use-case';
import { FindForumByIdUseCase } from './application/use-cases/forum-use-cases/find-forum-by-id.use-case';
import { CreateForumDto } from './infrastructure/dtos/create-forum.dto';
import { CreateForumUseCase } from './application/use-cases/forum-use-cases/create-forum.use-case';
import { Forum } from './domain/entities/forum';
import { FindCategoryByIdUseCase } from './application/use-cases/category-use-cases/find-category-by-id.use-case';
import { Expense } from './domain/entities/expense';
import { CreateExpenseUseCase } from './application/use-cases/expense-use-cases/create-expense.use-case';
import { FindExpensesByItineraryIdUseCases } from './application/use-cases/expense-use-cases/find-expenses-by-itinerary-id.use-case';
import { DeleteExpensesByIdUseCases } from './application/use-cases/expense-use-cases/delete-expense-by-id.use-case';
import { FindEventByProvinceAndDatesUseCase } from './application/use-cases/event-use-cases/find-event-by-province-and-dates.use-case';
import { Comment } from './domain/entities/comment';
import { CreateCommentUseCase } from './application/use-cases/comment-use-cases/create-comment.use-case';
import { FindEventByProvinceUseCase } from './application/use-cases/event-use-cases/find-event-by-province.use-case';
import { ubicationMiddleware } from './infrastructure/middlewares/ubication.middleware';
import { UpdateActivityUseCase } from './application/use-cases/activity-use-cases/update-activity.use-case';
import { SaveExpenseUseCase } from './application/use-cases/expense-use-cases/save-expense.use-case';
import { FindExpenseByIdUseCase } from './application/use-cases/expense-use-cases/find-expense-by-id.use-case';
import { DeletePublicationUseCase } from './application/use-cases/publication-use-cases/delete-publication.use-case';
import { FindCommentsByPublicationIdUserCase } from './application/use-cases/comment-use-cases/find-comments-by-publication-id.user-case';
import { DeleteCommentsUseCase } from './application/use-cases/comment-use-cases/delete-comments.use-case';
import { EventTempService } from './domain/services/event_temp.service';
import { FindItineraryByIdForDeleteUseCase } from './application/use-cases/itinerary-use-cases/find-itinerary-by-id-for-delete.use-case';
import { DeleteActivitiesUseCase } from './application/use-cases/activity-use-cases/delete-activities.use-case';
import { DeleteEventsUseCase } from './application/use-cases/event-use-cases/delete-events.use-case';
import { DeleteExpensesByItineraryIdUseCase } from './application/use-cases/expense-use-cases/delete-expenses-by-itinerary-id.use-case';
import { DeleteForumUseCase } from './application/use-cases/forum-use-cases/delete-forum.use-case';
import { DeleteItineraryByIdUseCase } from './application/use-cases/itinerary-use-cases/delete-itinerary-by-id.use-case';
import { DeletePublicationsByActivitiesUseCase } from './application/use-cases/publication-use-cases/delete-publications-by-activities.use-case';
import { DeleteMessageUseCase } from './application/use-cases/message-use-cases/delete-messages.use-case';
import { UpdateItineraryUseCase } from './application/use-cases/itinerary-use-cases/update-itinerary.use-case';
import { FindNotificationsByUserUseCase } from './application/use-cases/notification-use-cases/find-notifications-by-user.use-case';
import { FindNotificationsDetailByUserUseCase } from './application/use-cases/notification-use-cases/find-notifications-detail-by-user.use-case';
import { UpdateNotificationUseCase } from './application/use-cases/notification-use-cases/update-notification.use-case';
import { ParticipationRequestService } from './domain/services/participationRequest.service';
import { DeleteNotificationByIdUseCase } from './application/use-cases/notification-use-cases/delete-notification-by-id.use-case';
import { UpdateForumUseCase } from './application/use-cases/forum-use-cases/update-forum.use-case';
import { UserExpense } from './domain/entities/user_expense';
import { UserExpenseService } from './domain/services/user-expense.service';
import { DistributionType } from './domain/enum/distribution-type.enum';
import { ExpenseService } from './domain/services/expense.service';
import { UpdateItineraryNameUseCase } from './application/use-cases/itinerary-use-cases/update-itinerary-name.use-case';
import { FindAllTypeUseCase } from './application/use-cases/type-use-cases/find-all-type.use-case';
import { FindAllPriceLevelUseCase } from './application/use-cases/price-level-use-cases/find-all-price-level.use-case';
import {
  FindPublicationsByActivitiesIdsUseCase
} from './application/use-cases/publication-use-cases/find-publications-by-activities-ids.use-case';
import {
  FindNotificationByPublicationIdAndTypeUseCase
} from './application/use-cases/notification-use-cases/find-notification-by-publication-id-and-type.use-case';
import multer from 'multer';
import { Notification } from './domain/entities/notification';
import { CreateNotificationUseCase } from './application/use-cases/notification-use-cases/create-notification.use-case';
import {
  RejectParticipationRequestUseCase
} from './application/use-cases/participation-request-use-cases/reject-participation-request.use-case';
import { UpdateEventUseCase } from './application/use-cases/event-use-cases/update-event.use-case';
import {
  DeleteUserExpenseByExpenseIdUseCase
} from './application/use-cases/user-expense-use-cases/delete-user-expense-by-expense-id.use-case';

dotenv.config();

const getCorsOrigins = () => {
  const corsOriginsString = process.env.CORS_ORIGINS || '';

  return corsOriginsString.split(',').map((origin) => origin.trim());
};

const app = express();

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: getCorsOrigins(),
    credentials: true,
  },
});

io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    console.log('Received message:', msg);
    io.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected client', socket.id);
  });
});

app.use(bodyParser.json());

app.use(cors({ credentials: true, origin: getCorsOrigins() }));

const upload = multer({
  limits: { fileSize: 200 * 1024 * 1024 },
  storage: multer.memoryStorage(),
});

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

    server.listen(process.env.HTTP_PORT, () => {
      console.log(`Server running on port ${process.env.HTTP_PORT}`);
    });
  })
  .catch((error) => console.log('Data Source initialization error', error));

const placeService = new PlaceService();
const publicationService = new PublicationService();
const reviewService = new ReviewService();
const itineraryService = new ItineraryService();
const eventTempService = new EventTempService();
const participationRequestService = new ParticipationRequestService();

const createCommentUseCase = new CreateCommentUseCase();
const createMessageUseCase = new CreateMessageUseCase();
const createProvinceUseCase = new CreateProvinceUseCase();
const createWeatherUseCase = new CreateWeatherUseCase();
const createForumUserCase = new CreateForumUseCase();
const createNotificationUseCase = new CreateNotificationUseCase();
const findActivityByIdUseCase = new FindActivityByIdUseCase();
const findAllCategoryUseCase = new FindAllCategoryUseCase();
const findAllForumUseCase = new FindAllForumUseCase();
const findAllPlaceUseCase = new FindAllPlaceUseCase();
const findAllProvinceUseCase = new FindAllProvinceUseCase();
const findAllPublicationUseCase = new FindAllPublicationUseCase();
const findAllReviewUseCase = new FindAllReviewUseCase();
const findAllUserUseCase = new FindAllUserUseCase();
const findAllWeatherUseCase = new FindAllWeatherUseCase();
const findCategoryByIdUseCase = new FindCategoryByIdUseCase();
const findCommentsByPublicationIdUserCase = new FindCommentsByPublicationIdUserCase();
const findEventByProvinceAndDatesUseCase = new FindEventByProvinceAndDatesUseCase();
const findEventByProvinceUseCase = new FindEventByProvinceUseCase();
const findForumByIdUseCase = new FindForumByIdUseCase();
const findItineraryByIdUseCase = new FindItineraryByIdUseCase();
const findItineraryByIdForDeleteUseCase = new FindItineraryByIdForDeleteUseCase();
const findItineraryByUserUseCase = new FindItineraryByUserUseCase();
const findItineraryByUserWithParticipantsUseCase = new FindItineraryByUserWithParticipantsUseCase();
const findItineraryWithParticipantsUseCase = new FindItineraryWithParticipantsUseCase();
const findPlaceByGoogleIdUseCase = new FindPlaceByGoogleIdUseCase();
const findPlaceByProvinceUseCase = new FindPlaceByProvinceUseCase();
const findProvinceByIdUseCase = new FindProvinceByIdUseCase();
const findProvinceByNameUseCase = new FindProvinceByNameUseCase();
const findPublicationsByActivitiesIdsUseCase = new FindPublicationsByActivitiesIdsUseCase();
const findPublicationByCategoryUseCase = new FindPublicationByCategoryUseCase();
const findPublicationByIdUseCase = new FindPublicationByIdUseCase();
const findPublicationByUserLikesUseCase = new FindPublicationByUserLikesUseCase();
const findPublicationByUserSavesUseCase = new FindPublicationByUserSavedUseCase();
const findPublicationByUserUseCase = new FindPublicationByUserUseCase();
const findReviewByGoogleIdUseCase = new FindReviewByGoogleIdUseCase();
const findReviewByPlaceIdUseCase = new FindReviewByPlaceIdUseCase();
const findUserByIdUseCase = new FindUserByIdUseCase();
const findUserByNameUseCase = new FindUserByNameUseCase();
const createExpenseUseCase = new CreateExpenseUseCase();
const findExpensesByItineraryIdUseCase = new FindExpensesByItineraryIdUseCases();
const findNotificationsByUserIdUseCase = new FindNotificationsByUserUseCase();
const findNotificationByPublicationIdAndTypeUseCase = new FindNotificationByPublicationIdAndTypeUseCase();
const findNotificationsDetailByUserIdUseCase = new FindNotificationsDetailByUserUseCase();
const deleteExpensesByIdUseCases = new DeleteExpensesByIdUseCases();
const saveExpenseUseCase = new SaveExpenseUseCase();
const findExpenseByIdUseCase = new FindExpenseByIdUseCase();
const deleteActivitiesUseCase = new DeleteActivitiesUseCase();
const deleteCommentsUseCase = new DeleteCommentsUseCase();
const deleteEventsUseCase = new DeleteEventsUseCase();
const deleteUserExpenseByExpenseIdUseCase = new DeleteUserExpenseByExpenseIdUseCase();
const deleteExpensesByItineraryIdUseCase = new DeleteExpensesByItineraryIdUseCase();
const deleteForumUseCase = new DeleteForumUseCase();
const deleteItineraryByIdUseCase = new DeleteItineraryByIdUseCase();
const deleteMessagesUseCase = new DeleteMessageUseCase();
const deletePublicationUseCase = new DeletePublicationUseCase();
const deletePublicationsByActivitiesUseCase = new DeletePublicationsByActivitiesUseCase();
const deleteNotificationByIdUseCase = new DeleteNotificationByIdUseCase();
const deleteParticipationRequestUseCase = new RejectParticipationRequestUseCase();
const updateActivityUseCase = new UpdateActivityUseCase();
const updateUserUseCase = new UpdateUserUseCase();
const updateForumUseCase = new UpdateForumUseCase();
const updateEventUseCase = new UpdateEventUseCase();
const userExpenseService = new UserExpenseService();
const expenseService = new ExpenseService();
const updateItineraryNameUseCase = new UpdateItineraryNameUseCase();
const findAllTypeUseCase = new FindAllTypeUseCase();
const findAllPriceLevelUseCase = new FindAllPriceLevelUseCase();

app.post('/auth/google', ubicationMiddleware, (req, res, next) => {
  const { latitude, longitude, province } = req.body;

  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

app.post('/itinerary/add-event', (req, res) => {
  const { itineraryId, eventId } = req.body;

  const addedEvent = itineraryService.addEventToItinerary(itineraryId, eventId);

  if (addedEvent) {
    return res.status(200).json({
      status: 'success',
      message: 'Event added to itinerary',
      event: addedEvent,
    });
  } else {
    return res.status(400).json({ status: 'error', message: 'Error adding event to itinerary' });
  }
});

app.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', (err: any, user: User) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_URL}/iniciar-sesion`);
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res.redirect(`${process.env.FRONTEND_URL}/iniciar-sesion`);
      }

      res.redirect(`${process.env.FRONTEND_URL}/crear-itinerario`);
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

    const weather = await createWeatherUseCase.execute(createWeatherDto);

    return res.status(status.CREATED).json({ statusCode: status.CREATED, data: weather });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error creating weather' });
  }
});

app.get('/weather', async (_req, res) => {
  try {
    const weather = await findAllWeatherUseCase.execute();

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

    const province = await createProvinceUseCase.execute(createProvinceDto);

    return res.status(status.CREATED).json({ statusCode: status.CREATED, data: province });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error creating province' });
  }
});

app.get('/province', async (_req, res) => {
  try {
    const provinces = await findAllProvinceUseCase.execute();

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

    const province = await findProvinceByIdUseCase.execute(Number(id));

    return res.status(status.OK).json({ statusCode: status.OK, data: province });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching province' });
  }
});

app.get('/place', async (_req, res) => {
  try {
    const places = await findAllPlaceUseCase.execute();

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

    const place = await findPlaceByGoogleIdUseCase.execute(googleId);

    return res.status(status.OK).json({ statusCode: status.OK, data: place });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching place' });
  }
});

app.get('/review', async (_req, res) => {
  try {
    const reviews = await findAllReviewUseCase.execute();

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

    const reviews = await findReviewByGoogleIdUseCase.execute(googleId);

    return res.status(status.OK).json({ statusCode: status.OK, data: reviews });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching reviews' });
  }
});

app.get('/type', async (_req, res) => {
  try {
    const types = await findAllTypeUseCase.execute();

    return res.status(status.OK).json({ statusCode: status.OK, data: types });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching types' });
  }
});

app.get('/price-level', async (_req, res) => {
  try {
    const priceLevel = await findAllPriceLevelUseCase.execute();

    return res.status(status.OK).json({ statusCode: status.OK, data: priceLevel });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching price level' });
  }
});

app.post('/formQuestion', authMiddleware, async (req: Request, res: Response) => {
  try {
    const createItineraryDto: CreateItineraryDto = req.body;

    const itinerary = await itineraryService.create(req.user as User, createItineraryDto);

    return res.status(status.CREATED).json({
      statusCode: status.CREATED,
      message: 'Itinerary created successfully',
      itineraryId: itinerary.id,
    });
  } catch (error) {
    console.error('Error creating itinerary: ', error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      statusCode: status.INTERNAL_SERVER_ERROR,
      message: `Error creating itinerary: ${error}`,
    });
  }
});

app.get('/events/:provinceId', async (req: Request, res: Response) => {
  try {
    const { provinceId } = req.params;

    const events = await findEventByProvinceUseCase.execute(Number(provinceId));

    return res.status(status.OK).json({ statusCode: status.OK, data: events });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching events' });
  }
});

app.post('/events/:provinceId', async (req: Request, res: Response) => {
  try {
    const { provinceId } = req.params;

    const { fromDate, toDate } = req.body;

    const events = await findEventByProvinceAndDatesUseCase.execute(
      Number(provinceId),
      fromDate,
      toDate,
    );

    return res.status(status.OK).json({ statusCode: status.OK, data: events });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching events' });
  }
});

app.get('/itinerary/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const itinerary = await findItineraryByIdUseCase.execute(Number(id));

    return res.status(status.OK).json({ statusCode: status.OK, data: { itinerary } });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching itinerary' });
  }
});

app.get('/user-itineraries', authMiddleware, async (req: Request, res: Response) => {
  try {
    const itineraries = await findItineraryByUserUseCase.execute(req.user as User);

    return res.status(status.OK).json({ statusCode: status.OK, data: itineraries });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching itineraries' });
  }
});

app.get('/user-all', (_req: Request, res: Response) => {
  try {
    const users = findAllUserUseCase.execute();

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

    const activity = await findActivityByIdUseCase.execute(Number(id));

    return res.status(status.OK).json({ statusCode: status.OK, data: activity });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching activity' });
  }
});

app.get('/fetch-activities-places/:province', async (req: Request, res: Response) => {
  const provinceName = req.params.province;

  try {
    const province = await findProvinceByNameUseCase.execute(provinceName);

    if (!province) {
      return res.status(404).json({
        status: 'error',
        message: 'Province not found.',
      });
    }

    const places = await findPlaceByProvinceUseCase.execute(province.id as number);

    res.json({
      status: 'success',
      data: places,
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: 'An error occurred.',
    });
  }
});

app.get('/fetch-reviews', async (_req, res) => {
  try {
    const places = await findAllPlaceUseCase.execute();

    for (const place of places) {
      await reviewService.fetchReviews(place.googleId);
    }
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching reviews' });
  }
});

app.put('/itinerary/:itineraryId/name', authMiddleware, (req: Request, res: Response) => {
  try {
    const itineraryId = req.params.itineraryId;

    const { name } = req.body;

    return updateItineraryNameUseCase.execute(Number(itineraryId), name);
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error updating itinerary name' });
  }
});

app.post('/itinerary/add-user', authMiddleware, (req, res) => {
  const { itineraryId, participantId, participationRequestId } = req.body;

  itineraryService
    .addUserToItinerary(itineraryId, participantId, participationRequestId)
    .then(async (updatedItinerary) => {
      io.emit('usersAddItinerary', { updatedItinerary });
      return res.status(200).json({ status: 'success', data: { updatedItinerary } });
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).json({ status: 'error', message: 'Error adding user to itinerary' });
    });
});

app.delete('/itinerary/remove-user', authMiddleware, async (req, res) => {
  const { itineraryId, participantId } = req.body;

  itineraryService
    .removeUserFromItinerary(itineraryId, participantId)
    .then(() => {
      io.emit('userRemoved', { itineraryId, participantId });
      return res
        .status(200)
        .json({ status: 'success', message: `User with ID ${participantId} removed` });
    })
    .catch(() => {
      return res.status(500).json({ status: 'error', message: 'Error removing user to itinerary' });
    });
});

app.get('/itinerary/participants/:itineraryId', authMiddleware, async (req, res) => {
  const { itineraryId } = req.params;

  const userSession = req.user as User;

  if (!itineraryId) {
    return res.status(400).json({ status: 'error', message: 'itineraryId is required' });
  }

  try {
    const itineraryParticipants = await findItineraryWithParticipantsUseCase.execute(
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

    io.emit('usersUpdated', { itineraryParticipants });

    return res.status(200).json({ status: 'success', itineraryParticipants });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Error fetching itinerary' });
  }
});

app.post('/itinerary/add-activity', (req, res) => {
  const { itineraryId, createActivityDto } = req.body;

  itineraryService
    .addActivityToItinerary(itineraryId, createActivityDto)
    .then((itinerary) => {
      io.emit('addActivity', {
        itinerary,
      });
      return res
        .status(200)
        .json({ status: 'success', message: `Activity added to itinerary`, itinerary });
    })
    .catch(() => {
      return res
        .status(500)
        .json({ status: 'error', message: 'Error adding activity to itinerary' });
    });
});

app.post('/itinerary/add-event', (req, res) => {
  const { itineraryId, eventId } = req.body;
  itineraryService
    .addEventToItinerary(itineraryId, eventId)
    .then((addedEvent) => {
      if (addedEvent && Object.keys(addedEvent).length > 0) {
        return res.status(200).json({
          status: 'success',
          message: 'Event added to itinerary',
          event: addedEvent,
        });
      } else {
        return res.status(400).json({ status: 'error', message: 'Event not found or invalid' });
      }
    })
    .catch(() => {
      return res.status(500).json({ status: 'error', message: 'Error adding event to itinerary' });
    });
});

app.put('/itinerary/update-activity', async (req, res) => {
  const { activityId, start, end } = req.body;

  try {
    await itineraryService.updateDateActivityDates(activityId, new Date(start), new Date(end));
    io.emit('activityUpdated', {
      activityId,
      start: new Date(start),
      end: new Date(end),
    });
    return res.status(200).json({ status: 'success', message: `Activity ${activityId} updated` });
  } catch (error) {
    console.error('Error updating activity dates:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to update activity' });
  }
});

app.delete('/itinerary/remove-activity', async (req, res) => {
  const { itineraryId, activityId } = req.body;

  try {
    await itineraryService.removeActivityFromItinerary(itineraryId, activityId);
    io.emit('activityRemoved', {
      itineraryId,
      activityId,
    });
    return res
      .status(200)
      .json({ status: 'success', message: `Activity with ID ${activityId} removed` });
  } catch (error) {
    console.error('Error removing activity from itinerary:');
    return res.status(500).json({ status: 'error' });
  }
});

app.delete('/itinerary/remove-event', async (req, res) => {
  const { itineraryId, eventId } = req.body;

  try {
    await itineraryService.removeEventFromItinerary(itineraryId, eventId);
    io.emit('eventRemoved', {
      itineraryId,
      eventId,
    });
    return res.status(200).json({ status: 'success', message: `Event with ID ${eventId} removed` });
  } catch (error) {
    console.error('Error removing event from itinerary:');
    return res.status(500).json({ status: 'error' });
  }
});

app.get('/itinerary/byUser/:userId', authMiddleware, (req, res) => {
  let user = req.user as User;

  findItineraryByUserWithParticipantsUseCase
    .execute(Number(user.id))
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
  const { name, itineraryId } = req.query;

  try {
    let excludedIds: number[] = [];

    if (itineraryId) {
      const itinerary = await findItineraryWithParticipantsUseCase.execute(Number(itineraryId));

      if (itinerary && Array.isArray(itinerary.participants)) {
        excludedIds = itinerary.participants.map((participant: User) => participant.id);
        excludedIds.push(itinerary.user.id);
      }
    }

    const users = await findUserByNameUseCase.execute(name as string);

    if (!Array.isArray(users)) {
      return res.status(500).json({ status: 'error', message: 'Unexpected users format' });
    }

    const filteredUsers = users.filter((user) => !excludedIds.includes(user.id));
    return res.status(200).json({ status: 'success', data: filteredUsers });
  } catch (error) {
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
    return res.status(500).json({ message: 'Error fetching province', error });
  }
});

app.get('/province/places/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const places = await placeService.findManyByPlaceProvinceId(Number(id));

    if (!places) {
      return res.status(404).json({ message: 'Province not found' });
    }

    return res.json(places);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching province places', error });
  }
});

app.get('/publications', async (_req: Request, res: Response) => {
  try {
    const publications = await findAllPublicationUseCase.execute();

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
      publications = await findPublicationByUserUseCase.execute(Number(userID));
    }

    if (!publications) {
      return res.status(404).json({ message: 'Were not found publications' });
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
      publications = await findPublicationByUserLikesUseCase.execute(Number(userID));
    }

    if (!publications) {
      return res.status(404).json({ message: 'Were not found publications' });
    }

    return res.json(publications);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Error fetching publications', error });
  }
});

app.get('/publications/saved/:userId', authMiddleware, async (req: Request, res: Response) => {
  const user = req.user as User;

  try {
    let publications;

    if (!isNaN(Number(user.id))) {
      publications = await findPublicationByUserSavesUseCase.execute(Number(user.id));
    }

    if (!publications) {
      return res.status(404).json({ message: 'Were not found publications' });
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
      publications = await findPublicationByCategoryUseCase.execute(Number(categoryId));
    }

    if (!publications) {
      return res.status(404).json({ message: 'Were not found publications' });
    }

    return res.json(publications);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching publications', error });
  }
});

app.get('/publication/:publicationId', async (req: Request, res: Response) => {
  const { publicationId } = req.params;

  try {
    let publication;

    if (!isNaN(Number(publicationId))) {
      publication = await findPublicationByIdUseCase.execute(Number(publicationId));
    }

    if (!publication) {
      return res.status(404).json({ message: 'Were not found publication' });
    }

    return res.json(publication);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching publications', error });
  }
});

app.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await findAllCategoryUseCase.execute();

    if (!categories) {
      return res.status(404).json({ message: 'Were not found categories' });
    }

    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching categories', error });
  }
});
app.get('/places/province?', async (req: Request, res: Response) => {
  const { provinceId, types, count = 4, offset = 0 } = req.query;
  console.log(types);
  try {
    const places = await placeService.findPlaceByProvinceAndTypes(
      Number(provinceId),
      types as string,
      Number(count),
      Number(offset),
    );
    return res.status(status.OK).json({ statusCode: status.OK, data: places });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ statusCode: status.INTERNAL_SERVER_ERROR, message: 'Error fetching places' });
  }
});

app.get('/reviews/place/:idGoogle', async (req: Request, res: Response) => {
  const { idGoogle } = req.params;

  try {
    const reviews = await findReviewByPlaceIdUseCase.execute(idGoogle);

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this place' });
    }

    return res.json(reviews);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching reviews and place', error });
  }
});

app.get('/place/:idGoogle', async (req: Request, res: Response) => {
  const { idGoogle } = req.params;

  try {
    const place = await findPlaceByGoogleIdUseCase.execute(idGoogle);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    return res.json(place);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching place', error });
  }
});

app.put('/editProfile', authMiddleware, async (req: Request, res: Response) => {
  const { description, location, birthdate, profilePicture, coverPicture } = req.body;

  try {
    let user = req.user as User;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.description = description || user.description;
    user.location = location || user.location;
    user.birthdate = birthdate ? new Date(birthdate) : user.birthdate;
    user.profilePicture = profilePicture || user.profilePicture;
    user.coverPicture = coverPicture || user.coverPicture;

    await updateUserUseCase.execute(user);

    return res.json({ message: 'Data modified successfully', user });
  } catch (error) {
    return res.status(500).json({ message: 'Error modifying data', error });
  }
});

app.put('/editForum', authMiddleware, async (req: Request, res: Response) => {
  const { name, description, categoryId, forumId } = req.body;

  try {
    let user = req.user as User;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const forum = await findForumByIdUseCase.execute(Number(forumId));

    if (forum && forum.messages.length < 1) {
      forum.category = await findCategoryByIdUseCase.execute(Number(categoryId));
      forum.description = description;
      forum.name = name;
      await updateForumUseCase.execute(forum);
    } else {
      return res.status(404).json({ message: "Can't delete the forum" });
    }

    return res.json({ message: 'Data modified successfully', forum });
  } catch (error) {
    return res.status(500).json({ message: 'Error modifying data', error });
  }
});

app.post('/createPublication', authMiddleware, async (req: Request, res: Response) => {
  try {
    const createPublicationDTO: CreatePublicationDTO = req.body;

    const publication = await publicationService.createPublication(
      createPublicationDTO,
      req.user as User,
    );

    return res.status(status.CREATED).json({ statusCode: status.CREATED, data: publication });
  } catch (error) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      statusCode: status.INTERNAL_SERVER_ERROR,
      message: error || 'Error creating publication',
    });
  }
});

app.post('/createEventTemp', authMiddleware, async (req: Request, res: Response) => {
  try {
    const CreateEventDTO: CreateEventDTO = req.body;

    const event = await eventTempService.createEventTemp(CreateEventDTO, req.user as User);

    return res.status(status.CREATED).json({ statusCode: status.CREATED, data: event });
  } catch (error) {
    console.log(error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      statusCode: status.INTERNAL_SERVER_ERROR,
      message: error || 'Error creating event',
    });
  }
});

app.post('/createForum', authMiddleware, async (req: Request, res: Response) => {
  try {
    const createForumDTO: CreateForumDto = req.body;
    const { name, description, categoryId } = createForumDTO;

    const forum = new Forum();

    try {
      forum.category = await findCategoryByIdUseCase.execute(Number(categoryId));
      forum.name = name;
      forum.description = description;
      forum.messages = [];
      forum.isPublic = true;
      forum.user = req.user as User;

      await createForumUserCase.execute(forum);
    } catch (error) {
      throw new Error(error as string);
    }

    return res.status(status.CREATED).json({ statusCode: status.CREATED, data: forum });
  } catch (error) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      statusCode: status.INTERNAL_SERVER_ERROR,
      message: error || 'Error creating publication',
    });
  }
});

app.post('/handleLike/:publicationId', authMiddleware, async (req: Request, res: Response) => {
  const { publicationId } = req.params;

  const publication = await findPublicationByIdUseCase.execute(Number(publicationId));

  publicationService
    .handleLike(publication, req.user as User)
    .then(() => {
      return res
        .status(200)
        .json({ status: 'success', data: { message: 'Publication added successfully' } });
    })
    .catch(() => {
      return res.status(500).json({ status: 'error', message: 'Error adding user to likes' });
    });
});

app.post('/handleSaved/:publicationId', authMiddleware, async (req: Request, res: Response) => {
  const { publicationId } = req.params;

  const publication = await findPublicationByIdUseCase.execute(Number(publicationId));

  publicationService
    .handleSaved(publication, req.user as User)
    .then(() => {
      return res
        .status(200)
        .json({ status: 'success', data: { message: 'Publication added successfully' } });
    })
    .catch(() => {
      return res.status(500).json({ status: 'error', message: 'Error adding user to saved' });
    });
});

app.post('/handleReposts/:publicationId', authMiddleware, async (req: Request, res: Response) => {
  const { publicationId } = req.params;

  const publication = await findPublicationByIdUseCase.execute(Number(publicationId));

  publicationService
    .handleReposts(publication, req.user as User)
    .then(() => {
      return res
        .status(200)
        .json({ status: 'success', data: { message: 'Publications repost successfully' } });
    })
    .catch(() => {
      return res.status(500).json({ status: 'error', message: 'Error adding user to reposts' });
    });
});

app.get('/forums', async (_req: Request, res: Response) => {
  try {
    const forums = await findAllForumUseCase.execute();

    if (!forums) {
      return res.status(404).json({ message: 'Were not found forums' });
    }

    return res.json(forums);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching forums', error });
  }
});

app.get('/forum/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const forum = await findForumByIdUseCase.execute(id);

    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    return res.json(forum);
  } catch (error) {
    return res.status(500).json({ message: 'Error getting forum', error });
  }
});

app.post('/expenses', async (req, res) => {
  try {
    const {
      description,
      date,
      payerId,
      totalAmount,
      distributionType,
      participatingUsers,
      itineraryId,
      individualAmounts,
      individualPercentages,
      imageUrls,
    } = req.body;

    if (
      !description ||
      !date ||
      !payerId ||
      totalAmount == null ||
      !distributionType ||
      !itineraryId
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const payer = await findUserByIdUseCase.execute(payerId);
    const itinerary = await findItineraryByIdUseCase.execute(itineraryId);

    if (!payer || !itinerary) {
      return res.status(404).json({ message: 'Payer or Itinerary not found' });
    }

    const users = await Promise.all(
      participatingUsers.map((userId: number) => findUserByIdUseCase.execute(userId)),
    );

    const validUsers = users.filter((user) => user);

    const calculateUserAmount = (user: any): number => {
      if (distributionType === DistributionType.CUSTOM) {
        return individualAmounts[user.id] || 0;
      } else if (distributionType === DistributionType.EQUAL) {
        const baseAmount = totalAmount / participatingUsers.length;

        const roundedAmount = parseFloat(baseAmount.toFixed(2));
    
        const totalDistributed = roundedAmount * (participatingUsers.length - 1);
    
        const remainingAmount = totalAmount - totalDistributed;
    
        const amountOwed =
          user.id === participatingUsers[participatingUsers.length - 1].id
            ? parseFloat(remainingAmount.toFixed(2)) 
            : roundedAmount;

        return amountOwed;
      } else if (distributionType === DistributionType.PERCENTAGE) {
        return Number(((totalAmount * (individualPercentages[user.id] || 0)) / 100).toFixed(2));
      }
      return 0;
    };

    const userExpensesPromises = validUsers.map((user) => {
      const userAmount = calculateUserAmount(user);

      const userExpense = new UserExpense();
      userExpense.user = user;
      userExpense.amount = userAmount;
      userExpense.isPaid = userExpense.isPaid = user.id === payer.id;

      return userExpenseService.createUserExpense(userExpense);
    });

    const userExpenses = await Promise.all(userExpensesPromises);

    const expense = new Expense();
    expense.description = description;
    expense.date = new Date(date);
    expense.totalAmount = totalAmount;
    expense.distributionType = distributionType;
    expense.payer = payer;
    expense.itinerary = itinerary;
    expense.individualAmounts = individualAmounts || {};
    expense.participatingUsers = validUsers;
    expense.individualPercentages = individualPercentages || {};
    expense.imageUrls = imageUrls;
    expense.userExpenses = userExpenses;

    const savedExpense = await createExpenseUseCase.execute(expense);

    res.status(200).json(savedExpense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/expenses/:idExpense', async (req, res) => {
  const { idExpense } = req.params;

  try {
    const {
      description,
      date,
      payerId,
      totalAmount,
      distributionType,
      participatingUsers,
      itineraryId,
      individualAmounts,
      individualPercentages,
      imageUrls,
    } = req.body;

    if (
      !idExpense ||
      !description ||
      !date ||
      !payerId ||
      totalAmount == null ||
      !distributionType ||
      !itineraryId
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const payer = await findUserByIdUseCase.execute(payerId);
    const itinerary = await findItineraryByIdUseCase.execute(itineraryId);
    if (!payer || !itinerary) {
      return res.status(404).json({ message: 'Payer or Itinerary not found' });
    }

    const existingExpense = await findExpenseByIdUseCase.execute(Number(idExpense));
    if (!existingExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Get the instances of participating users
    const users = await Promise.all(
      participatingUsers.map((userId: number) => findUserByIdUseCase.execute(userId)),
    );
    const validUsers = users.filter((user) => user);

    const calculateUserAmount = (user: User): number => {
      if (distributionType === DistributionType.CUSTOM) {
        return individualAmounts[user.id] || 0;
      } else if (distributionType === DistributionType.EQUAL) {
        const baseAmount = totalAmount / participatingUsers.length;

        const roundedAmount = parseFloat(baseAmount.toFixed(2));
    
        const totalDistributed = roundedAmount * (participatingUsers.length - 1);
    
        const remainingAmount = totalAmount - totalDistributed;
    
        const amountOwed =
          user.id === participatingUsers[participatingUsers.length - 1].id
            ? parseFloat(remainingAmount.toFixed(2)) 
            : roundedAmount;

        return amountOwed;
      } else if (distributionType === DistributionType.PERCENTAGE) {
        return Number(((totalAmount * (individualPercentages[user.id] || 0)) / 100).toFixed(2));
      }
      return 0;
    };
    // Create user expenses if not already present or modify existing ones
    const userExpensesPromises = validUsers.map((user: User) => {
      const userAmount = calculateUserAmount(user);
      existingExpense.userExpenses = existingExpense.userExpenses || [];
      // Check if a user expense already exists for this user
      const existingUserExpense = existingExpense.userExpenses.find(
        (userExpense: UserExpense) => userExpense.user.id === user.id,
      );

      let userExpense: UserExpense;
      if (existingUserExpense) {
        // Update the existing user expense
        console.log("Entro existingUserExpense", existingUserExpense)
        userExpense = existingUserExpense;
        userExpense.amount = userAmount;
        userExpense.isPaid = user.id === payer.id;
        userExpense.expense = existingExpense
        userExpenseService.updateUserExpense(userExpense); 
      } else {
        // Create a new user expense
        userExpense = new UserExpense();
        userExpense.user = user;
        userExpense.amount = userAmount;
        userExpense.isPaid = user.id === payer.id;
        userExpense.expense = existingExpense;
        userExpenseService.createUserExpense(userExpense);
      }

      return userExpense;
    });

   // Remove expenses for users no longer participating
   const userExpensesToRemove = existingExpense.userExpenses.filter((userExpense: UserExpense) =>
    !validUsers.some((user) => user.id === userExpense.user.id)
  );
  
  // Remove user expenses that are no longer in the list of participating users
  await Promise.all(userExpensesToRemove.map((userExpense: UserExpense) => 
    userExpenseService.deleteUserExpense(userExpense.id) // Assuming there's a delete method for user expenses
  ));

    const userExpenses = await Promise.all(userExpensesPromises);

    // Update the expense fields
    existingExpense.description = description;
    existingExpense.date = new Date(date);
    existingExpense.totalAmount = totalAmount;
    existingExpense.distributionType = distributionType;
    existingExpense.payer = payer;
    existingExpense.itinerary = itinerary;
    existingExpense.individualAmounts = individualAmounts || {};
    existingExpense.participatingUsers = validUsers;
    existingExpense.individualPercentages = individualPercentages || {};
    existingExpense.imageUrls = imageUrls;
    existingExpense.userExpenses = userExpenses;

    // Save the update
    const response = await saveExpenseUseCase.execute(existingExpense);

    res.status(200).json({
      status: 'success'});
  } catch (error) {
    console.error('Error editing expense:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

app.get('/expenses/:itineraryId', async (req, res) => {
  const { itineraryId } = req.params;

  try {
    const expenses = await findExpensesByItineraryIdUseCase.execute(Number(itineraryId));

    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error obtaining expenses:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/expenses/debt/user/itinerary/:itineraryId', authMiddleware, async (req, res) => {
  const { itineraryId } = req.params;
  const user = req.user as User;
  try {
    const debt = await expenseService.debtByUserId(user.id, Number(itineraryId));

    res.status(200).json(debt);
  } catch (error) {
    console.error('Error obtaining expenses:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/expenses/debt/payer/itinerary/:itineraryId', authMiddleware, async (req, res) => {
  const { itineraryId } = req.params;
  const user = req.user as User;
  try {
    const debt = await expenseService.getDebts(user.id, Number(itineraryId));

    res.status(200).json(debt);
  } catch (error) {
    console.error('Error obtaining expenses:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.patch('/expenses/settle', authMiddleware, async (req, res) => {
  const { userId, itineraryId } = req.body;
  try {
    const debt = await expenseService.settle(Number(userId), Number(itineraryId));
    res.status(200).json(debt);
  } catch (error) {
    console.error('Error obtaining expenses:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/expenses/:expenseId', async (req, res) => {
  const { expenseId } = req.params;

  try {
    const expenses = await deleteExpensesByIdUseCases.execute(Number(expenseId));

    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error deleting an expense:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/notifications/byUser', authMiddleware, async (req, res) => {
  const user = req.user as User;
  try {
    const notifications = await findNotificationsByUserIdUseCase.execute(Number(user.id));
    res.status(200).json(notifications);
  } catch (error) {
    console.log('Error obtaining notifications:', error);
    console.error('Error obtaining notifications:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/notifications-detail/byUser', authMiddleware, async (req, res) => {
  const user = req.user as User;
  try {
    const notifications = await findNotificationsDetailByUserIdUseCase.execute(Number(user.id));
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error obtaining notifications:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/markNotificationsAsRead', authMiddleware, async (req, res) => {
  const user = req.user as User;
  try {
    const notifications = await findNotificationsDetailByUserIdUseCase.execute(Number(user.id));
    const updateNotificationUseCase = new UpdateNotificationUseCase();
    const filteredNotifications = notifications.filter((notification) => !notification.isRead);

    for (const notification of filteredNotifications) {
      notification.isRead = true;
      await updateNotificationUseCase.execute(notification);
    }

    res.status(200).json(filteredNotifications);
  } catch (error) {
    console.error('Error obtaining notifications:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/addImagesToActivity', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { activityId, images } = req.body;

    console.log(images);
    const activity = await findActivityByIdUseCase.execute(Number(activityId));

    for (const image of images) {
      activity?.images.push(image);
    }

    if (!activity) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const updatedActivity = await updateActivityUseCase.execute(activity);

    return res.json(updatedActivity);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error loading images', error });
  }
});

app.get('/participation-request/:participantId', async (req: Request, res: Response) => {
  const { participantId } = req.params;

  try {
    const participationRequests =
      await participationRequestService.getParticipationRequestsByParticipant(
        Number(participantId),
      );

    return res.status(200).json({
      status: 'success',
      data: participationRequests,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Error fetching participation requests',
    });
  }
});

app.post('/participation-request', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { itineraryId, participantId } = req.body;
    const user = req.user as User;

    const participationRequest = await participationRequestService.sendParticipationRequest(
      itineraryId,
      participantId,
      user,
    );

    return res.status(200).json({
      status: 'success',
      message: 'Participation request sent successfully',
      data: participationRequest,
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : 'Error sending participation request',
    });
  }
});

app.post('/participation-request/accept', async (req: Request, res: Response) => {
  try {
    const { requestId } = req.body;
    const participationRequest = await participationRequestService.acceptParticipationRequest(
      Number(requestId),
    );
    res.status(200).json({
      status: 'success',
      data: participationRequest,
    });
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : 'Error accept participation request',
    });
  }
});

app.post('/participation-request/reject', async (req: Request, res: Response) => {
  const { requestId, notificationId } = req.body;

  try {
    await deleteNotificationByIdUseCase.execute(notificationId);
    const rejectedRequest = await participationRequestService.rejectParticipationRequest(requestId);

    return res.status(200).json({
      status: 'success',
      message: 'Participation request rejected successfully',
      data: rejectedRequest,
    });
  } catch (error) {
    console.error('Error rejecting participation request:', error);

    return res.status(400).json({
      message: error instanceof Error ? error.message : 'Error rejecting participation request',
    });
  }
});

app.post('/uploadImage', upload.single('image'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No se subió ningún archivo');
  }

  const formData = new FormData();
  formData.append('image', req.file.buffer.toString('base64'));

  const url = `${process.env.IMGUR_API_URL}/3/image`;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
    },
    body: formData,
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error de respuesta:', errorData);
      throw new Error(errorData.data.error || 'Error al cargar la imagen');
    }
    const result = await response.json();
    console.log('Imagen subida:', result);
    res.status(200).json({ link: result.data.link });
  } catch (error) {
    console.error('Error en la carga de la imagen:', error);
    res.status(500).send('Error en la carga de la imagen');
  }
});

io.on('connection', (socket) => {
  socket.on('createMessage', async (data) => {
    try {
      const { content, images, forumId, userId } = data;

      const forum = await findForumByIdUseCase.execute(Number(forumId));

      if (!forum) {
        socket.emit('error', { message: 'Forum not found' });
        return;
      }

      const message = new Message();

      message.forum = forum;
      message.user = await findUserByIdUseCase.execute(userId);
      message.content = content;
      message.images = images ? images : [];

      await createMessageUseCase.execute(message);

      io.emit('receiveMessage', {
        content: message.content,
        images: message.images,
        user: message.user,
        createdAt: message.createdAt,
        forumId: message.forum.id,
      });
    } catch (error) {
      socket.emit('error', { message: 'Error creating message', error });
    }
  });

  socket.on('createComment', async (data) => {
    try {
      const { content, publicationId, userId } = data;

      const publication = await findPublicationByIdUseCase.execute(Number(publicationId));

      if (!publication) {
        socket.emit('error', { message: 'Publication not found' });
        return;
      }

      const comment = new Comment();

      const user = await findUserByIdUseCase.execute(userId);
      comment.user = user;
      comment.publication = publication;
      comment.description = content;

      const savedComment = await createCommentUseCase.execute(comment);

      const notification = new Notification();

      notification.participationRequest = null;
      notification.description =  user?.name + ' comentó tu publicación!'
      notification.user = publication.user;
      notification.isRead = false;
      notification.itinerary = null;
      notification.publication = publication;
      notification.comment = savedComment;

      await createNotificationUseCase.execute(notification);

      io.emit('receiveComment', {
        description: comment.description,
        user: comment.user,
        createdAt: comment.createdAt,
      });
    } catch (error) {
      console.log(error)
      socket.emit('error', { message: 'Error creating comment', error });
    }
  });

  socket.on('deletePublication', async (data) => {
    try {
      const { publicationId, userId } = data;

      const publication = await findPublicationByIdUseCase.execute(Number(publicationId));

      if (!publication) {
        socket.emit('error', { message: 'Publication not found' });
        return;
      }

      if (publication.user.id !== userId) {
        socket.emit('error', { message: 'The publication does not belong to you' });
        return;
      }

      if (publication.comments.length > 0) {
        const comments = await findCommentsByPublicationIdUserCase.execute(Number(publicationId));
        await deleteCommentsUseCase.execute(comments);
      }

      if (publication.notifications.length > 0) {
        for (const notification of publication.notifications) {
          await deleteNotificationByIdUseCase.execute(notification.id);
        }
      }

      await deletePublicationUseCase.execute(publication);

      io.emit('receiveDelete', {});
    } catch (error) {
      socket.emit('error', { message: 'Error deleting publication', error });
    }
  });

  socket.on('deleteItinerary', async (data) => {
    try {
      const { itineraryId, userId } = data;

      const itinerary = await findItineraryByIdForDeleteUseCase.execute(Number(itineraryId));

      if (!itinerary || itinerary.user.id != userId) {
        console.log('The itinerary belongs to another user');
        return;
      }

      const activityIds = itinerary.activities.map(activity => activity.id);

      const publications = await findPublicationsByActivitiesIdsUseCase.execute(activityIds);

      for (const publication of publications) {
        if (publication.comments.length > 0) {
          await deleteCommentsUseCase.execute(publication.comments);
        }

        if(publication.notifications.length > 0) {
          for (const notification of publication.notifications) {
            await deleteNotificationByIdUseCase.execute(notification.id);
          }
        }
      }

      const publicationIds = publications.map(publication => publication.id);

      if(publicationIds.length > 0) {
        await deletePublicationsByActivitiesUseCase.execute(publicationIds);
      }

      if (itinerary.notifications.length > 0) {
        for (const notification of itinerary.notifications) {
          await deleteNotificationByIdUseCase.execute(notification.id);
        }
      }

      if (itinerary.participationRequests.length > 0){
        for (const participationRequest of itinerary.participationRequests) {
          for (const notification of participationRequest.notifications) {
            await deleteNotificationByIdUseCase.execute(notification.id);
          }
          await deleteParticipationRequestUseCase.execute(participationRequest.id);
        }
      }

      if (itinerary.activities.length > 0) {
        await deleteActivitiesUseCase.execute(itinerary.activities);
      }

      if (itinerary.events.length > 0) {
        for (const event of itinerary.events) {
         event.itinerary = null;
         await updateEventUseCase.execute(event);
        }
      }

      if (itinerary.expenses.length > 0) {
        for (const expense of itinerary.expenses) {
          await deleteUserExpenseByExpenseIdUseCase.execute(expense.id);
        }
        await deleteExpensesByItineraryIdUseCase.execute(itinerary.expenses);
      }

      if (itinerary.forum) {
        const forum = await findForumByIdUseCase.execute(itinerary.forum.id);

        if (forum != null && forum.messages.length > 0) {
          await deleteMessagesUseCase.execute(forum.messages);
        }

        itinerary.forum = null;
        const updateItineraryUseCase = new UpdateItineraryUseCase();
        await updateItineraryUseCase.execute(itinerary);

        if (forum != null) {
          await deleteForumUseCase.execute(forum);
        }
      }

      await deleteItineraryByIdUseCase.execute(itinerary);

      io.emit('receiveDelete', {});
    } catch (error) {
      console.log(error);
      socket.emit('error', { message: 'Error deleting itinerary', error });
    }
  });
});

export default app;
