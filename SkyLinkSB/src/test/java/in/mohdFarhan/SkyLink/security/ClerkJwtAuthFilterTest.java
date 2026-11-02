package in.mohdFarhan.SkyLink.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import java.security.KeyPair;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ClerkJwtAuthFilterTest {

    private static final String ISSUER = "https://clerk.example.com";
    private static final String KID = "test-kid";
    private static final String DOWNLOAD_URI = "/api/v1.0/files/download/f1";

    private final KeyPair clerkKeys = Keys.keyPairFor(SignatureAlgorithm.RS256);
    private ClerkJwtAuthFilter filter;

    @BeforeEach
    void setUp() throws Exception {
        ClerkJwksProvider jwksProvider = mock(ClerkJwksProvider.class);
        when(jwksProvider.getPublicKey(KID)).thenReturn(clerkKeys.getPublic());
        filter = new ClerkJwtAuthFilter(jwksProvider);
        ReflectionTestUtils.setField(filter, "clerkIssuer", ISSUER);
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void downloadWithoutTokenPassesThroughUnauthenticated() throws Exception {
        MockFilterChain chain = new MockFilterChain();

        filter.doFilter(new MockHttpServletRequest("GET", DOWNLOAD_URI), new MockHttpServletResponse(), chain);

        assertNotNull(chain.getRequest(), "request should reach the controller");
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void downloadWithValidTokenAuthenticatesOwner() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", DOWNLOAD_URI);
        request.addHeader("Authorization", "Bearer " + token(clerkKeys, "user_owner"));
        MockFilterChain chain = new MockFilterChain();

        filter.doFilter(request, new MockHttpServletResponse(), chain);

        assertNotNull(chain.getRequest());
        assertEquals("user_owner", SecurityContextHolder.getContext().getAuthentication().getName());
    }

    @Test
    void downloadWithForgedTokenIsRejected() throws Exception {
        KeyPair attackerKeys = Keys.keyPairFor(SignatureAlgorithm.RS256);
        MockHttpServletRequest request = new MockHttpServletRequest("GET", DOWNLOAD_URI);
        request.addHeader("Authorization", "Bearer " + token(attackerKeys, "user_owner"));
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filter.doFilter(request, response, chain);

        assertEquals(HttpServletResponse.SC_FORBIDDEN, response.getStatus());
        assertNull(chain.getRequest());
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void togglePublicWithoutTokenIsRejected() throws Exception {
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filter.doFilter(new MockHttpServletRequest("PATCH", "/api/v1.0/files/f1/toggle-public"), response, chain);

        assertEquals(HttpServletResponse.SC_FORBIDDEN, response.getStatus());
        assertNull(chain.getRequest());
    }

    private static String token(KeyPair keys, String subject) {
        return Jwts.builder()
                .setHeaderParam("kid", KID)
                .setSubject(subject)
                .setIssuer(ISSUER)
                .setExpiration(new Date(System.currentTimeMillis() + 60_000))
                .signWith(keys.getPrivate(), SignatureAlgorithm.RS256)
                .compact();
    }
}
