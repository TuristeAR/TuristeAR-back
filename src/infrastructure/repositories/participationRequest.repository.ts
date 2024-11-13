import { ParticipationRequest } from "../../domain/entities/participationRequest";
import { ParticipationRequestRepositoryInterface } from "../../domain/repositories/participant_request.repository.interface";
import { AppDataSource } from "../database/data-source";
import { AbstractRepository } from "./abstract.repository";

export class ParticipationRequestRepository
    extends AbstractRepository<ParticipationRequest>
    implements ParticipationRequestRepositoryInterface
{
    constructor() {
        super(AppDataSource.getRepository(ParticipationRequest));
    }
    async updateStatus(id: number, status:  "pending" | "accepted" | "rejected"): Promise<ParticipationRequest> {
        const request = await this.findOne({where: {id:id}});
        if (!request) throw new Error('Request not found');
        request.status = status;
        return await this.save(request);
      }
}