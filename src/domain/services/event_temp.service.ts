import { CreateEventDTO } from "../../infrastructure/dtos/create-event.dto";
import { User } from "../entities/user";
import { EventTemp } from "../entities/event_temp";
import { ProvinceService } from './province.service';
import { CreateEventTempUseCase } from "../../application/use-cases/event-use-cases/create-event-temp.use-case";

export class EventTempService {

    private provinceService: ProvinceService;

    constructor() {
        this.provinceService = new ProvinceService();
    }

    async createEventTemp(eventTempDTO: CreateEventDTO, user: User): Promise<EventTemp> {
        const provinceService = new ProvinceService();
        const {name, fromDate, toDate, locality, description, province, image } = eventTempDTO;

        console.log(name, fromDate, toDate, locality, description, province, image  )

        const newEvent = new EventTemp();


        newEvent.name = name;
        newEvent.fromDate = new Date(fromDate);
        newEvent.toDate = new Date(toDate);
        newEvent.locality = locality;
        newEvent.description = description;
        newEvent.image = image;

        const provinceObj = await this.provinceService.getProvinceFromId(
            eventTempDTO.province,
        );

        newEvent.province = provinceObj!;
        newEvent.user = user;

        const createEventUseCase = new CreateEventTempUseCase();

        return createEventUseCase.execute(newEvent);

    }
}