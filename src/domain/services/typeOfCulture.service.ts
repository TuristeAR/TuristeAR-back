import { TypeOfCulture } from '../entities/typeOfCulture';
import { CreateTypeOfCultureDto } from '../../application/dtos/create-typeOfCulture.dto';
import { TypeOfCultureRepository } from '../repositories/typeOfCulture.repository';

export class TypeOfCultureService {
    private typeOfCultureRepository: TypeOfCultureRepository;

    constructor() {
        this.typeOfCultureRepository = new TypeOfCultureRepository();
    }

    create(createTypeOfCultureDto: CreateTypeOfCultureDto): Promise<TypeOfCulture> {
        return this.typeOfCultureRepository.create(createTypeOfCultureDto);
    }

    findAll(): Promise<TypeOfCulture[]> {
        return this.typeOfCultureRepository.findMany({});
    }

    findOneById(id: number): Promise<TypeOfCulture | null> {
        return this.typeOfCultureRepository.findOne({ where: { id } });
    }
}
