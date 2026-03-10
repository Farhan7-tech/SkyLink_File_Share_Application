package in.mohdFarhan.SkyLink.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "support_tickets")
@Getter
@Setter
public class SupportTicket {

    @Id
    private String id;

    private String name;

    private String email;

    private String subject;

    private String message;

    @Field("created_at")
    private LocalDateTime createdAt;

    public SupportTicket() {
        this.createdAt = LocalDateTime.now();
    }
}
