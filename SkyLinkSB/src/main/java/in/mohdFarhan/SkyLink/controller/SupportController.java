package in.mohdFarhan.SkyLink.controller;

import in.mohdFarhan.SkyLink.entity.SupportTicket;
import in.mohdFarhan.SkyLink.service.SupportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/support")
public class SupportController {

    private final SupportService supportService;

    @Autowired
    public SupportController(SupportService supportService) {
        this.supportService = supportService;
    }

    @PostMapping
    public ResponseEntity<SupportTicket> createSupportTicket(@RequestBody SupportTicket supportTicket) {
        SupportTicket savedTicket = supportService.saveTicket(supportTicket);
        return ResponseEntity.ok(savedTicket);
    }
}
