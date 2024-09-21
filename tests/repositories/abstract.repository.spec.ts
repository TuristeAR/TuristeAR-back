import { Repository } from 'typeorm';
import { AbstractRepository } from '../../src/utils/abstract.repository';
import { mock, instance, when, verify } from 'ts-mockito';

class TestEntity {
  id: number;
  name: string;
}

class TestRepository extends AbstractRepository<TestEntity> {
  static create(repository: Repository<TestEntity>): TestRepository {
    return new TestRepository(repository);
  }
}

describe('AbstractRepository', () => {
  let repository: Repository<TestEntity>;
  let abstractRepository: TestRepository;

  beforeEach(() => {
    repository = mock(Repository);
    abstractRepository = TestRepository.create(instance(repository));
  });

  it('creates and saves an entity', async () => {
    const data = { name: 'Test' };
    const entity = { id: 1, name: 'Test' };

    when(repository.create(data)).thenReturn(entity);
    when(repository.save(entity)).thenResolve(entity);

    const result = await abstractRepository.create(data);

    expect(result).toEqual(entity);
    verify(repository.create(data)).once();
    verify(repository.save(entity)).once();
  });

  it('finds one entity by options', async () => {
    const options = { where: { id: 1 } };
    const entity = { id: 1, name: 'Test' };

    when(repository.findOne(options)).thenResolve(entity);

    const result = await abstractRepository.findOne(options);

    expect(result).toEqual(entity);
    verify(repository.findOne(options)).once();
  });

  it('returns null if no entity is found', async () => {
    const options = { where: { id: 1 } };

    when(repository.findOne(options)).thenResolve(null);

    const result = await abstractRepository.findOne(options);

    expect(result).toBeNull();
    verify(repository.findOne(options)).once();
  });
});
