import { ItineraryRepository } from '../repositories/itinerary.repository';
import { ProvinceService } from './province.service';
import { PlaceService } from './place.service';
import { Itinerary } from '../entities/itinerary';
import { CreateItineraryDto } from '../../application/dtos/create-itinerary.dto';
import { ActivityService } from './activity.service';
import { Place } from '../entities/place';
import { User } from '../entities/user';
import { CreateActivityDto } from '../../application/dtos/create-activity.dto';
import { UserService } from './user.service';
import { Publication } from '../entities/publication';
import { CategoryRepository } from '../repositories/category.repository';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  findAll(){
    return this.categoryRepository.findMany({});
  }

}
