import { AbstractRepository } from '../../utils/abstract.repository';
import { AppDataSource } from '../../infrastructure/database/data-source';
import { TypeOfCulture } from '../entities/typeOfCulture';

export class TypeOfCultureRepository extends AbstractRepository<TypeOfCulture> {
    
    constructor() {
        super(AppDataSource.getRepository(TypeOfCulture));
    }
}
