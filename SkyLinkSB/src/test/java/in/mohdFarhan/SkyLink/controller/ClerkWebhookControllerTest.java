package in.mohdFarhan.SkyLink.controller;

import in.mohdFarhan.SkyLink.service.ProfileService;
import in.mohdFarhan.SkyLink.service.UserCreditsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ClerkWebhookControllerTest {

    private static final String SECRET = "whsec_" + Base64.getEncoder().encodeToString("test-webhook-signing-secret".getBytes(StandardCharsets.UTF_8));
    private static final String MSG_ID = "msg_2abc";
    private static final String PAYLOAD = "{\"type\":\"user.created\",\"data\":{\"id\":\"user_123\","
            + "\"email_addresses\":[{\"email_address\":\"jane@example.com\"}],\"first_name\":\"Jane\"}}";

    private ProfileService profileService;
    private UserCreditsService userCreditsService;
    private ClerkWebhookController controller;

    @BeforeEach
    void setUp() {
        profileService = mock(ProfileService.class);
        userCreditsService = mock(UserCreditsService.class);
        controller = new ClerkWebhookController(profileService, userCreditsService);
        ReflectionTestUtils.setField(controller, "webhookSecret", SECRET);
    }

    @Test
    void signHelperMatchesSvixDocumentationExample() throws Exception {
        // Example from Svix's "verifying webhooks manually" docs
        String signature = sign("whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw", "msg_p5jXN8AQM9LWM0D4loKWxJek",
                "1614265330", "{\"test\": 2432232314}");

        assertEquals("v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=", signature);
    }

    @Test
    void validSignatureIsAcceptedAndEventProcessed() throws Exception {
        String timestamp = now();

        ResponseEntity<?> response = controller.handleClerkWebhook(MSG_ID, timestamp, sign(SECRET, MSG_ID, timestamp, PAYLOAD), PAYLOAD);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(profileService).createProfile(any());
        verify(userCreditsService).createInitialCredits("user_123");
    }

    @Test
    void anyMatchingSignatureInHeaderIsAccepted() throws Exception {
        String timestamp = now();
        String header = "v1,c29tZS1vbGQtc2lnbmF0dXJl " + sign(SECRET, MSG_ID, timestamp, PAYLOAD);

        ResponseEntity<?> response = controller.handleClerkWebhook(MSG_ID, timestamp, header, PAYLOAD);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void tamperedPayloadIsRejected() throws Exception {
        String timestamp = now();
        String signature = sign(SECRET, MSG_ID, timestamp, PAYLOAD);
        String tampered = PAYLOAD.replace("user_123", "user_attacker");

        assertRejected(controller.handleClerkWebhook(MSG_ID, timestamp, signature, tampered));
    }

    @Test
    void signatureFromDifferentSecretIsRejected() throws Exception {
        String timestamp = now();
        String otherSecret = "whsec_" + Base64.getEncoder().encodeToString("another-secret".getBytes(StandardCharsets.UTF_8));

        assertRejected(controller.handleClerkWebhook(MSG_ID, timestamp, sign(otherSecret, MSG_ID, timestamp, PAYLOAD), PAYLOAD));
    }

    @Test
    void signatureForDifferentMessageIdIsRejected() throws Exception {
        String timestamp = now();

        assertRejected(controller.handleClerkWebhook("msg_other", timestamp, sign(SECRET, MSG_ID, timestamp, PAYLOAD), PAYLOAD));
    }

    @Test
    void staleTimestampIsRejected() throws Exception {
        String timestamp = String.valueOf(Instant.now().minusSeconds(10 * 60).getEpochSecond());

        assertRejected(controller.handleClerkWebhook(MSG_ID, timestamp, sign(SECRET, MSG_ID, timestamp, PAYLOAD), PAYLOAD));
    }

    @Test
    void futureTimestampIsRejected() throws Exception {
        String timestamp = String.valueOf(Instant.now().plusSeconds(10 * 60).getEpochSecond());

        assertRejected(controller.handleClerkWebhook(MSG_ID, timestamp, sign(SECRET, MSG_ID, timestamp, PAYLOAD), PAYLOAD));
    }

    @Test
    void malformedHeadersAreRejected() {
        assertRejected(controller.handleClerkWebhook(MSG_ID, "not-a-number", "v1,abc", PAYLOAD));
        assertRejected(controller.handleClerkWebhook(MSG_ID, now(), "v1,%%%not-base64%%%", PAYLOAD));
        assertRejected(controller.handleClerkWebhook(MSG_ID, now(), "garbage", PAYLOAD));
    }

    private void assertRejected(ResponseEntity<?> response) {
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verifyNoInteractions(profileService, userCreditsService);
    }

    private static String now() {
        return String.valueOf(Instant.now().getEpochSecond());
    }

    private static String sign(String secret, String msgId, String timestamp, String payload) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(Base64.getDecoder().decode(secret.substring("whsec_".length())), "HmacSHA256"));
        byte[] signature = mac.doFinal((msgId + "." + timestamp + "." + payload).getBytes(StandardCharsets.UTF_8));
        return "v1," + Base64.getEncoder().encodeToString(signature);
    }
}
