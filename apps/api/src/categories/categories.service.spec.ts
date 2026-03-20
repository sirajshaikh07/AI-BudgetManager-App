import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { Category, CategoryType } from './entities/category.entity';

describe('CategoriesService', () => {
    let service: CategoriesService;

    const mockDefaultCategory = {
        id: 'cat-uuid-food',
        userId: null,
        name: 'Food & Dining',
        type: CategoryType.EXPENSE,
        parentId: null,
        icon: 'fork-knife',
        color: '#EF4444',
        isDefault: true,
        createdAt: new Date(),
    } as Category;

    const mockUserCategory = {
        id: 'cat-uuid-custom',
        userId: 'user-uuid-1',
        name: 'Side Income',
        type: CategoryType.INCOME,
        parentId: null,
        icon: 'star',
        color: '#7C3AED',
        isDefault: false,
        createdAt: new Date(),
    } as Category;

    const mockCategoryRepository = {
        find: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoriesService,
                { provide: getRepositoryToken(Category), useValue: mockCategoryRepository },
            ],
        }).compile();

        service = module.get<CategoriesService>(CategoriesService);
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return global defaults plus user custom categories', async () => {
            mockCategoryRepository.find.mockResolvedValue([mockDefaultCategory, mockUserCategory]);

            const result = await service.findAll('user-uuid-1');

            expect(result).toHaveLength(2);
            expect(mockCategoryRepository.find).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.arrayContaining([
                        expect.objectContaining({ isDefault: true }),
                        expect.objectContaining({ userId: 'user-uuid-1' }),
                    ]),
                }),
            );
        });
    });

    describe('create', () => {
        it('should create a custom category for the user', async () => {
            mockCategoryRepository.create.mockReturnValue(mockUserCategory);
            mockCategoryRepository.save.mockResolvedValue(mockUserCategory);

            const dto = { name: 'Side Income', type: CategoryType.INCOME, icon: 'star', color: '#7C3AED' };
            const result = await service.create('user-uuid-1', dto);

            expect(result.isDefault).toBe(false);
            expect(result.userId).toBe('user-uuid-1');
            expect(mockCategoryRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({ userId: 'user-uuid-1', isDefault: false }),
            );
        });

        it('should set isDefault to false regardless of DTO input', async () => {
            const categoryWithForced = { ...mockUserCategory, isDefault: false };
            mockCategoryRepository.create.mockReturnValue(categoryWithForced);
            mockCategoryRepository.save.mockResolvedValue(categoryWithForced);

            const dto = { name: 'Side Income', type: CategoryType.INCOME };
            const result = await service.create('user-uuid-1', dto);

            expect(result.isDefault).toBe(false);
        });
    });

    describe('findDefaults', () => {
        it('should return only global default categories', async () => {
            mockCategoryRepository.find.mockResolvedValue([mockDefaultCategory]);

            const result = await service.findDefaults();

            expect(result).toHaveLength(1);
            expect(result[0].isDefault).toBe(true);
            expect(result[0].userId).toBeNull();
            expect(mockCategoryRepository.find).toHaveBeenCalledWith(
                expect.objectContaining({ where: { isDefault: true, userId: expect.anything() } }),
            );
        });

        it('should return 14 default categories after seeding', async () => {
            const defaults = Array.from({ length: 14 }, (_, i) => ({
                ...mockDefaultCategory,
                id: `cat-uuid-${i}`,
                name: `Category ${i}`,
            })) as Category[];
            mockCategoryRepository.find.mockResolvedValue(defaults);

            const result = await service.findDefaults();

            expect(result).toHaveLength(14);
        });
    });
});
