import { User } from '../../../../src/domain/entities/user';
import { ParticipationRequest } from '../../../../src/domain/entities/participationRequest';
import { Itinerary } from '../../../../src/domain/entities/itinerary';
import { Publication } from '../../../../src/domain/entities/publication';
import { Notification } from '../../../../src/domain/entities/notification';
import { NotificationRepositoryInterface } from '../../../../src/domain/repositories/notification.repository.interface';
import {
  UpdateNotificationUseCase
} from '../../../../src/application/use-cases/notification-use-cases/update-notification.use-case';
import { Comment } from '../../../../src/domain/entities/comment';
jest.mock('../../../../src/infrastructure/repositories/forum.repository');


const user = new User();
user.id = 1;

const publication = new Publication();
publication.id = 1;

const mockNotification : Notification = {
  id: 1,
  createdAt: new Date(),
  description: 'Notificación del Estadio Monumental',
  isRead: true,
  user: user,
  publication: publication,
  itinerary: new Itinerary(),
  participationRequest: new ParticipationRequest(),
  comment: new Comment()
}

describe('FindNotificationDetailByUserUseCase', () => {
  let updateNotificationUseCase : UpdateNotificationUseCase;
  let mockNotificationRepository: jest.Mocked<NotificationRepositoryInterface>;

  beforeEach(() => {
    mockNotificationRepository = {
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      deleteOne: jest.fn(),
    };

    updateNotificationUseCase = new UpdateNotificationUseCase();
    (updateNotificationUseCase as any).notificationRepository = mockNotificationRepository;
  });

  it('should update forum successfully', async () => {
    mockNotificationRepository.save.mockResolvedValue(mockNotification);

    const result = await updateNotificationUseCase.execute(mockNotification);
    expect(result).toEqual(mockNotification);
    expect(mockNotificationRepository.save).toHaveBeenCalledWith(mockNotification);
  })

})