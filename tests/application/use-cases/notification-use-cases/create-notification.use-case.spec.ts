import { User } from '../../../../src/domain/entities/user';
import { Notification } from '../../../../src/domain/entities/notification';
import { Publication } from '../../../../src/domain/entities/publication';
import { Itinerary } from '../../../../src/domain/entities/itinerary';
import { ParticipationRequest } from '../../../../src/domain/entities/participationRequest';
import {
  CreateNotificationUseCase
} from '../../../../src/application/use-cases/notification-use-cases/create-notification.use-case';
import { NotificationRepositoryInterface } from '../../../../src/domain/repositories/notification.repository.interface';
import { Comment } from '../../../../src/domain/entities/comment';
jest.mock('../../../../src/infrastructure/repositories/notification.repository');


const user = new User();
user.id = 1;

const mockNotification : Notification = {
  id: 1,
  createdAt: new Date(),
  description: 'Foro del Estadio Monumental',
  isRead: true,
  user: user,
  publication: new Publication(),
  itinerary: new Itinerary(),
  participationRequest: new ParticipationRequest(),
  comment: new Comment()
}

describe('CreateNotificationUseCase', () => {
  let createNotificationUseCase : CreateNotificationUseCase;
  let mockNotificationRepository: jest.Mocked<NotificationRepositoryInterface>;

  beforeEach(() => {
    mockNotificationRepository = {
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      deleteOne: jest.fn(),
    };

    createNotificationUseCase = new CreateNotificationUseCase();
    (createNotificationUseCase as any).notificationRepository = mockNotificationRepository;
  });

  it('should create an notification successfully', async () => {
    mockNotificationRepository.create.mockResolvedValue(mockNotification);
    const result = await createNotificationUseCase.execute(mockNotification);
    expect(mockNotificationRepository.create).toHaveBeenCalledWith(mockNotification);

    expect(result).toEqual(mockNotification);
  })

  it('should throw an error if notification is invalid', async () => {
    mockNotificationRepository.create.mockRejectedValue(new Error('Invalid notification'));

    await expect(createNotificationUseCase.execute(mockNotification)).rejects.toThrow('Invalid notification');

  })

})