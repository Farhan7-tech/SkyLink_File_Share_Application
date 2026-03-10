package in.mohdFarhan.SkyLink.service;

import in.mohdFarhan.SkyLink.entity.SupportTicket;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Value("${app.mail.from:no-reply@skylink.com}")
    private String fromAddress;

    @Value("${app.mail.replyTo:support@skylink.com}")
    private String replyToAddress;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendSupportAcknowledgement(@NonNull SupportTicket ticket) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
            helper.setTo(ticket.getEmail());
            helper.setFrom(fromAddress);
            helper.setReplyTo(replyToAddress);
            helper.setSubject("We’ve received your request • SkyLink Support");

            String name = ticket.getName() != null && !ticket.getName().isBlank() ? ticket.getName() : "there";
            String subject = ticket.getSubject() != null ? ticket.getSubject() : "Support request";
            String preview = "Thanks for reaching out — your ticket is in our queue.";

            String html = """
                <div style="font-family: Inter, Arial, sans-serif; font-size: 14px; color: #111827; line-height: 1.6;">
                  <div style="max-width: 640px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg,#6d28d9,#8b5cf6); padding: 20px 24px;">
                      <h1 style="margin:0; color: #fff; font-size: 20px;">SkyLink Support</h1>
                      <p style="margin:8px 0 0; color:#ede9fe; font-size: 14px;">%s</p>
                    </div>
                    <div style="padding: 24px; background: #ffffff;">
                      <p>Hi %s,</p>
                      <p>Thanks for contacting our support team. We’ve received your request and assigned it to one of our specialists.</p>
                      <div style="margin:16px 0; padding:12px 16px; border:1px solid #e5e7eb; border-radius:8px; background:#fafafa;">
                        <div style="font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing: .04em;">Subject</div>
                        <div style="font-weight:600; margin-top:4px;">%s</div>
                      </div>
                      <p>What happens next:</p>
                      <ul style="margin: 8px 0 16px 20px; padding:0;">
                        <li>Our team reviews your message.</li>
                        <li>We may reach out if we need more details.</li>
                        <li>You’ll receive a reply via this email.</li>
                      </ul>
                      <p style="margin:0;">We aim to respond within a few business hours.</p>
                      <p style="margin:16px 0 0;">In the meantime, you can continue using SkyLink — we’re on it!</p>
                      <p style="margin:24px 0 0;">Best regards,<br/>SkyLink Support</p>
                    </div>
                    <div style="padding: 16px 24px; background: #f9fafb; color:#6b7280; font-size:12px;">
                      <p style="margin:0;">If you didn’t submit this request, you can ignore this email.</p>
                      <p style="margin:8px 0 0;">Replies sent to this email will reach our support team.</p>
                    </div>
                  </div>
                </div>
                """.formatted(preview, name, subject);

            helper.setText(html, true);
            mailSender.send(message);
        } catch (MessagingException | RuntimeException e) {
            logger.error("Email sending failed for support ticket id={} email={}",
                    ticket.getId(), ticket.getEmail(), e);
        }
    }
}

