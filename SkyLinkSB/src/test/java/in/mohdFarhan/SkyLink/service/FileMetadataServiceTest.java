package in.mohdFarhan.SkyLink.service;

import in.mohdFarhan.SkyLink.document.FileMetadataDocument;
import in.mohdFarhan.SkyLink.document.ProfileDocument;
import in.mohdFarhan.SkyLink.dto.FileMetadataDTO;
import in.mohdFarhan.SkyLink.repository.FileMetadataRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class FileMetadataServiceTest {

    private static final String OWNER_ID = "user_owner";
    private static final String OTHER_USER_ID = "user_other";

    private ProfileService profileService;
    private FileMetadataRepository fileMetadataRepository;
    private FileMetadataService fileMetadataService;

    @BeforeEach
    void setUp() {
        profileService = mock(ProfileService.class);
        fileMetadataRepository = mock(FileMetadataRepository.class);
        fileMetadataService = new FileMetadataService(profileService, mock(UserCreditsService.class), fileMetadataRepository);
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    // --- getDownloadableFile ---

    @Test
    void anonymousUserCanDownloadPublicFile() {
        storeFile("f1", true);
        signInAnonymously();

        FileMetadataDTO file = fileMetadataService.getDownloadableFile("f1");

        assertEquals("f1", file.getId());
    }

    @Test
    void anonymousUserCannotDownloadPrivateFile() {
        storeFile("f1", false);
        signInAnonymously();

        assertStatus(HttpStatus.NOT_FOUND, () -> fileMetadataService.getDownloadableFile("f1"));
    }

    @Test
    void requestWithoutAuthenticationCannotDownloadPrivateFile() {
        storeFile("f1", false);

        assertStatus(HttpStatus.NOT_FOUND, () -> fileMetadataService.getDownloadableFile("f1"));
    }

    @Test
    void ownerCanDownloadPrivateFile() {
        storeFile("f1", false);
        signInAs(OWNER_ID);

        FileMetadataDTO file = fileMetadataService.getDownloadableFile("f1");

        assertEquals("f1", file.getId());
    }

    @Test
    void otherUserCannotDownloadPrivateFile() {
        storeFile("f1", false);
        signInAs(OTHER_USER_ID);

        assertStatus(HttpStatus.NOT_FOUND, () -> fileMetadataService.getDownloadableFile("f1"));
    }

    @Test
    void downloadingMissingFileReturnsNotFound() {
        when(fileMetadataRepository.findById("missing")).thenReturn(Optional.empty());
        signInAs(OWNER_ID);

        assertStatus(HttpStatus.NOT_FOUND, () -> fileMetadataService.getDownloadableFile("missing"));
    }

    @Test
    void downloadDoesNotCreateProfileForAnonymousUser() {
        storeFile("f1", true);
        signInAnonymously();

        fileMetadataService.getDownloadableFile("f1");

        verifyNoInteractions(profileService);
    }

    // --- togglePublic ---

    @Test
    void ownerCanTogglePublic() {
        FileMetadataDocument file = storeFile("f1", false);
        currentProfileIs(OWNER_ID);

        FileMetadataDTO result = fileMetadataService.togglePublic("f1");

        assertTrue(result.getIsPublic());
        assertTrue(file.getIsPublic());
        verify(fileMetadataRepository).save(file);
    }

    @Test
    void otherUserCannotTogglePublic() {
        FileMetadataDocument file = storeFile("f1", false);
        currentProfileIs(OTHER_USER_ID);

        assertStatus(HttpStatus.FORBIDDEN, () -> fileMetadataService.togglePublic("f1"));

        assertFalse(file.getIsPublic());
        verify(fileMetadataRepository, never()).save(any());
    }

    @Test
    void togglingMissingFileReturnsNotFound() {
        when(fileMetadataRepository.findById("missing")).thenReturn(Optional.empty());
        currentProfileIs(OWNER_ID);

        assertStatus(HttpStatus.NOT_FOUND, () -> fileMetadataService.togglePublic("missing"));
        verify(fileMetadataRepository, never()).save(any());
    }

    private FileMetadataDocument storeFile(String id, boolean isPublic) {
        FileMetadataDocument file = FileMetadataDocument.builder()
                .id(id)
                .name("report.pdf")
                .clerkId(OWNER_ID)
                .isPublic(isPublic)
                .fileContent(new byte[]{1, 2, 3})
                .build();
        when(fileMetadataRepository.findById(id)).thenReturn(Optional.of(file));
        return file;
    }

    private void signInAs(String clerkId) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(clerkId, null, AuthorityUtils.createAuthorityList("ROLE_ADMIN")));
    }

    // What Spring Security's AnonymousAuthenticationFilter sets on permitAll endpoints
    private void signInAnonymously() {
        SecurityContextHolder.getContext().setAuthentication(
                new AnonymousAuthenticationToken("key", "anonymousUser", AuthorityUtils.createAuthorityList("ROLE_ANONYMOUS")));
    }

    private void currentProfileIs(String clerkId) {
        when(profileService.getCurrentProfile()).thenReturn(ProfileDocument.builder().clerkId(clerkId).build());
    }

    private static void assertStatus(HttpStatus expected, org.junit.jupiter.api.function.Executable executable) {
        ResponseStatusException e = assertThrows(ResponseStatusException.class, executable);
        assertEquals(expected, e.getStatusCode());
    }
}
