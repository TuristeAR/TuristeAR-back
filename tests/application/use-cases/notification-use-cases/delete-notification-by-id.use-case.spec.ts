import { ForumRepositoryInterface } from '../../../../src/domain/repositories/forum.repository.interface';
import { User } from '../../../../src/domain/entities/user';
import { DeleteForumUseCase } from '../../../../src/application/use-cases/forum-use-cases/delete-forum.use-case';
import { DeleteResult } from 'typeorm';
import { Notification } from '../../../../src/domain/entities/notification';
import { Publication } from '../../../../src/domain/entities/publication';
import { Itinerary } from '../../../../src/domain/entities/itinerary';
import { ParticipationRequest } from '../../../../src/domain/entities/participationRequest';
import { NotificationRepositoryInterface } from '../../../../src/domain/repositories/notification.repository.interface';
import {
  CreateNotificationUseCase
} from '../../../../src/application/use-cases/notification-use-cases/create-notification.use-case';
import {
  DeleteNotificationByIdUseCase
} from '../../../../src/application/use-cases/notification-use-cases/delete-notification-by-id.use-case';
import { Comment } from '../../../../src/domain/entities/comment';
jest.mock('../../../../src/infrastructure/repositories/forum.repository');


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


describe('DeleteNotificationUseCase', () => {
  let deleteNotificationByIdUseCase : DeleteNotificationByIdUseCase;
  let mockNotificationRepository: jest.Mocked<NotificationRepositoryInterface>;

  beforeEach(() => {
    mockNotificationRepository = {
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      deleteOne: jest.fn(),
    };

    deleteNotificationByIdUseCase = new DeleteNotificationByIdUseCase();
    (deleteNotificationByIdUseCase as any).notificationRepository = mockNotificationRepository;
  });

  it('should delete an forum successfully', async () => {
    const deleteResult : DeleteResult = {affected: 1, raw: {}};
    mockNotificationRepository.deleteOne.mockResolvedValue(deleteResult);
    const result = await deleteNotificationByIdUseCase.execute(mockNotification.id);
    expect(mockNotificationRepository.deleteOne).toHaveBeenCalledWith(mockNotification.id);
    expect(result).toEqual(deleteResult);
  })

  it('should throw an error if forum cannot be deleted', async () => {
    mockNotificationRepository.deleteOne.mockRejectedValue(new Error('Failed to delete notification'));

    await expect(deleteNotificationByIdUseCase.execute(mockNotification.id)).rejects.toThrow('Failed to delete notification');
  })

})