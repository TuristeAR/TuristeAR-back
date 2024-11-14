import { User } from '../../../../src/domain/entities/user';
import { ParticipationRequest } from '../../../../src/domain/entities/participationRequest';
import { Itinerary } from '../../../../src/domain/entities/itinerary';
import { Publication } from '../../../../src/domain/entities/publication';
import { Notification } from '../../../../src/domain/entities/notification';
import { NotificationRepositoryInterface } from '../../../../src/domain/repositories/notification.repository.interface';
import {
  FindNotificationsDetailByUserUseCase
} from '../../../../src/application/use-cases/notification-use-cases/find-notifications-detail-by-user.use-case';
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
}

describe('FindNotificationDetailByUserUseCase', () => {
  let findNotificationsDetailByUserUseCase : FindNotificationsDetailByUserUseCase;
  let mockNotificationRepository: jest.Mocked<NotificationRepositoryInterface>;

  beforeEach(() => {
    mockNotificationRepository = {
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      deleteOne: jest.fn(),
    };

    findNotificationsDetailByUserUseCase = new FindNotificationsDetailByUserUseCase();
    (findNotificationsDetailByUserUseCase as any).notificationRepository = mockNotificationRepository;
  });

  it('should return an notification by user id', async () => {
    mockNotificationRepository.findMany.mockResolvedValue([mockNotification]);

    const result = await findNotificationsDetailByUserUseCase.execute(1);

    expect(mockNotificationRepository.findMany).toHaveBeenCalledWith({
      where: { user : {id: user.id } },
      relations: ['user', 'publication.likes','publication.reposts',
        'publication.comments','publication.saved', 'itinerary.user',
        'participationRequest', 'participationRequest.sender',
        'participationRequest.sender', 'participationRequest.itinerary'],
      order: { id: 'DESC' },
    });

    expect(result).toEqual([mockNotification]);
  })

  it('should return [] if no notification is found', async () => {
    mockNotificationRepository.findMany.mockResolvedValue([]);

    const result = await findNotificationsDetailByUserUseCase.execute(10);

    expect(result).toEqual([]);
  })

  it('should throw an error if there is an issue with the repository', async () => {
    mockNotificationRepository.findMany.mockRejectedValue(new Error('Repository error'));

    await expect(findNotificationsDetailByUserUseCase.execute(1))
      .rejects
      .toThrow('Repository error');
  });

})