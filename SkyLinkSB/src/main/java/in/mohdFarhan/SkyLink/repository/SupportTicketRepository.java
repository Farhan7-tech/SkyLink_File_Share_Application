package in.mohdFarhan.SkyLink.repository;

import in.mohdFarhan.SkyLink.entity.SupportTicket;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SupportTicketRepository extends MongoRepository<SupportTicket, String> {
}
