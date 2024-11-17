import { Expense } from '../../../../src/domain/entities/expense';
import { ExpenseRepositoryInterface } from '../../../../src/domain/repositories/expense.repository.interface';
import { CreateExpenseUseCase } from '../../../../src/application/use-cases/expense-use-cases/create-expense.use-case';
import { User } from '../../../../src/domain/entities/user';
import { Itinerary } from '../../../../src/domain/entities/itinerary';
import { DistributionType } from '../../../../src/domain/enum/distribution-type.enum';

describe('CreateExpenseUseCase', () => {
  let createExpenseUseCase: CreateExpenseUseCase;
  let mockExpenseRepository: jest.Mocked<ExpenseRepositoryInterface>;

  beforeEach(() => {
    // Mock del repositorio
    mockExpenseRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      deleteOne: jest.fn(),
      deleteMany: jest.fn(), // Asegúrate de incluir esto
      update: jest.fn(),
    };

    // Crear una instancia de CreateExpenseUseCase con el mock del repositorio
    createExpenseUseCase = new CreateExpenseUseCase();
    (createExpenseUseCase as any).expenseRepository = mockExpenseRepository;
  });

  it('should create a new expense successfully', async () => {
    // Datos de ejemplo para un gasto
    const payer = { id: 1, name: 'John Doe' } as User;
    const itinerary = { id: 1, name: 'Trip to Paris' } as Itinerary;

    const expenseData: Expense = {
      id: 1,
      description: 'Dinner',
      date: new Date(),
      totalAmount: 100,
      distributionType: DistributionType.EQUAL,
      payer: payer,
      itinerary: itinerary,
      individualAmounts: { user1: 50, user2: 50 },
      individualPercentages: { user1: 50, user2: 50 },
      participatingUsers: [payer],
      createdAt: new Date(),
      imageUrls: [],
      userExpenses: []
    };

    // Configurar el mock para que retorne el gasto creado
    mockExpenseRepository.create.mockResolvedValue(expenseData);

    // Ejecutar el caso de uso
    const result = await createExpenseUseCase.execute(expenseData);

    // Verificar que el método `create` del repositorio fue llamado con los datos correctos
    expect(mockExpenseRepository.create).toHaveBeenCalledWith(expenseData);

    // Verificar que el resultado es el esperado
    expect(result).toEqual(expenseData);
  });

  it('should return null if creation fails', async () => {
    const expenseData: Expense = {
      id: 1,
      description: 'Dinner',
      date: new Date(),
      totalAmount: 100,
      distributionType: DistributionType.EQUAL,
      payer: { id: 1 } as User,
      itinerary: { id: 1 } as Itinerary,
      individualAmounts: { user1: 50, user2: 50 },
      individualPercentages: { user1: 50, user2: 50 },
      participatingUsers: [{ id: 1 } as User],
      createdAt: new Date(),
      imageUrls: [],
      userExpenses: []
    };

    // Configurar el mock para que retorne `null`
    mockExpenseRepository.create.mockResolvedValue(null);

    // Ejecutar el caso de uso
    const result = await createExpenseUseCase.execute(expenseData);

    // Verificar que el resultado es `null`
    expect(result).toBeNull();
  });
});
