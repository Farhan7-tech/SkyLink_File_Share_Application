package in.mohdFarhan.SkyLink.service;

import in.mohdFarhan.SkyLink.entity.SupportTicket;
import in.mohdFarhan.SkyLink.repository.SupportTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SupportService {

    private final SupportTicketRepository supportTicketRepository;
    private final EmailService emailService;

    @Autowired
    public SupportService(SupportTicketRepository supportTicketRepository, EmailService emailService) {
        this.supportTicketRepository = supportTicketRepository;
        this.emailService = emailService;
    }

    public SupportTicket saveTicket(SupportTicket ticket) {
        SupportTicket saved = supportTicketRepository.save(ticket);
        emailService.sendSupportAcknowledgement(saved);
        return saved;
    }
}
