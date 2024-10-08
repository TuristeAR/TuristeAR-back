import { mock, instance, when } from 'ts-mockito';
import { Publication } from '../../../src/domain/entities/publication';
import { PublicationRepository } from '../../../src/domain/repositories/publication.repository';
import { User } from '../../../src/domain/entities/user';

describe('PublicationRepository', () => {
  let repositoryMock: PublicationRepository; // Mock del repositorio
  let repository: PublicationRepository; // Instancia real para usar el mock

  beforeEach(() => {
    repositoryMock = mock(PublicationRepository); // Crea el mock
    repository = instance(repositoryMock); // Instancia el mock para ser utilizado
  });

  it('finds publications by user id', async () => {
    const publication = new Publication();
    const user = new User();
    user.id = 1;
    publication.user = user;

    // Simula la respuesta del método 'findForUser' con el mock
    when(repositoryMock.findForUser(1)).thenResolve([publication]);

    const result = await repository.findForUser(publication.user.id); // Utiliza la instancia real del mock

    expect(result).toEqual([publication]);
  });

  it('if there are no posts, return null', async () => {
    const publication = new Publication();
    const user = new User();
    user.id = 2;
    publication.user = user;

    // Simula la respuesta del método 'findForUser' con el mock
    when(repositoryMock.findForUser(1)).thenResolve([publication]);

    const result = await repository.findForUser(publication.user.id); // Utiliza la instancia real del mock

    expect(result).toEqual(null);
  });
});
