import { User } from '../../../../src/domain/entities/user';
import { ParticipationRequest } from '../../../../src/domain/entities/participationRequest';
import { Itinerary } from '../../../../src/domain/entities/itinerary';
import { Publication } from '../../../../src/domain/entities/publication';
import { Notification } from '../../../../src/domain/entities/notification';
import {
  FindNotificationByPublicationIdAndTypeUseCase
} from '../../../../src/application/use-cases/notification-use-cases/find-notification-by-publication-id-and-type.use-case';
import { NotificationRepositoryInterface } from '../../../../src/domain/repositories/notification.repository.interface';
import { Like } from 'typeorm';
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

describe('FindNotificationByPublicationIdAndTypeUseCase', () => {
  let findNotificationByPublicationIdAndTypeUseCase : FindNotificationByPublicationIdAndTypeUseCase;
  let mockNotificationRepository: jest.Mocked<NotificationRepositoryInterface>;

  beforeEach(() => {
    mockNotificationRepository = {
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      deleteOne: jest.fn(),
    };

    findNotificationByPublicationIdAndTypeUseCase = new FindNotificationByPublicationIdAndTypeUseCase();
    (findNotificationByPublicationIdAndTypeUseCase as any).notificationRepository = mockNotificationRepository;
  });

  it('should return an notification by publication id and type', async () => {
    mockNotificationRepository.findOne.mockResolvedValue(mockNotification);

    const result = await findNotificationByPublicationIdAndTypeUseCase.execute(1,'me gusta');

    expect(mockNotificationRepository.findOne).toHaveBeenCalledWith({
      where: { publication : {id: publication.id }, description: Like(`%me gusta%`), },
    });

    expect(result).toEqual(mockNotification);
  })

  it('should return null if no notification is found', async () => {
    mockNotificationRepository.findOne.mockResolvedValue(null);

    const result = await findNotificationByPublicationIdAndTypeUseCase.execute(10,'me gusta');

    expect(result).toBeNull();
  })

  it('should throw an error if there is an issue with the repository', async () => {
    mockNotificationRepository.findOne.mockRejectedValue(new Error('Repository error'));

    await expect(findNotificationByPublicationIdAndTypeUseCase.execute(1,'me gusta'))
      .rejects
      .toThrow('Repository error');
  });

})