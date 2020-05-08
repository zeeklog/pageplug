package com.appsmith.server.services;

import com.appsmith.external.models.Policy;
import com.appsmith.server.constants.FieldName;
import com.appsmith.server.domains.Application;
import com.appsmith.server.domains.Page;
import com.appsmith.server.dtos.OrganizationApplicationsDTO;
import com.appsmith.server.exceptions.AppsmithError;
import com.appsmith.server.exceptions.AppsmithException;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.List;
import java.util.Set;

import static com.appsmith.server.acl.AclPermission.MANAGE_APPLICATIONS;
import static com.appsmith.server.acl.AclPermission.MANAGE_PAGES;
import static com.appsmith.server.acl.AclPermission.READ_APPLICATIONS;
import static com.appsmith.server.acl.AclPermission.READ_PAGES;
import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
@Slf4j
@DirtiesContext
public class ApplicationServiceTest {

    @Autowired
    ApplicationService applicationService;

    @Autowired
    ApplicationPageService applicationPageService;

    @Autowired
    PageService pageService;

    @Test
    @WithUserDetails(value = "api_user")
    public void createApplicationWithNullName() {
        Application application = new Application();
        Mono<Application> applicationMono = Mono.just(application)
                .flatMap(applicationPageService::createApplication);
        StepVerifier
                .create(applicationMono)
                .expectErrorMatches(throwable -> throwable instanceof AppsmithException &&
                        throwable.getMessage().equals(AppsmithError.INVALID_PARAMETER.getMessage(FieldName.NAME)))
                .verify();
    }

    @Test
    @WithUserDetails(value = "api_user")
    public void createValidApplication() {
        Application testApplication = new Application();
        testApplication.setName("ApplicationServiceTest TestApp");
        Mono<Application> applicationMono = applicationPageService.createApplication(testApplication);

        Policy manageAppPolicy = Policy.builder().permission(MANAGE_APPLICATIONS.getValue())
                .users(Set.of("api_user"))
                .build();
        Policy readAppPolicy = Policy.builder().permission(READ_APPLICATIONS.getValue())
                .users(Set.of("api_user"))
                .build();

        Policy managePagePolicy = Policy.builder().permission(MANAGE_PAGES.getValue())
                .users(Set.of("api_user"))
                .build();
        Policy readPagePolicy = Policy.builder().permission(READ_PAGES.getValue())
                .users(Set.of("api_user"))
                .build();

        StepVerifier
                .create(applicationMono)
                .assertNext(application -> {
                    assertThat(application).isNotNull();
                    assertThat(application.getId()).isNotNull();
                    assertThat(application.getName().equals("ApplicationServiceTest TestApp"));
                    assertThat(application.getPolicies()).isNotEmpty();
                    assertThat(application.getPolicies()).containsAll(Set.of(manageAppPolicy, readAppPolicy));
                })
                .verifyComplete();
    }

    @Test
    @WithUserDetails(value = "api_user")
    public void defaultPageCreateOnCreateApplicationTest() {
        Application testApplication = new Application();
        testApplication.setName("ApplicationServiceTest TestAppForTestingPage");
        Flux<Page> pagesFlux = applicationPageService
                .createApplication(testApplication)
                .flatMapMany(application -> pageService.findByApplicationId(application.getId()));

        Policy managePagePolicy = Policy.builder().permission(MANAGE_PAGES.getValue())
                .users(Set.of("api_user"))
                .build();
        Policy readPagePolicy = Policy.builder().permission(READ_PAGES.getValue())
                .users(Set.of("api_user"))
                .build();

        StepVerifier
                .create(pagesFlux)
                .assertNext(page -> {
                    assertThat(page).isNotNull();
                    assertThat(page.getName()).isEqualTo(FieldName.DEFAULT_PAGE_NAME);
                    assertThat(page.getLayouts()).isNotEmpty();
                    assertThat(page.getPolicies()).isNotEmpty();
                    assertThat(page.getPolicies().containsAll(Set.of(managePagePolicy, readPagePolicy)));
                })
                .verifyComplete();
    }

    /* Tests for Get Application Flow */

    @Test
    @WithUserDetails(value = "api_user")
    public void getApplicationInvalidId() {
        Mono<Application> applicationMono = applicationService.getById("random-id");
        StepVerifier.create(applicationMono)
                .expectErrorMatches(throwable -> throwable instanceof AppsmithException &&
                        throwable.getMessage().equals(AppsmithError.NO_RESOURCE_FOUND.getMessage("resource", "random-id")))
                .verify();
    }

    @Test
    @WithUserDetails(value = "api_user")
    public void getApplicationNullId() {
        Mono<Application> applicationMono = applicationService.getById(null);
        StepVerifier.create(applicationMono)
                .expectErrorMatches(throwable -> throwable instanceof AppsmithException &&
                        throwable.getMessage().equals(AppsmithError.INVALID_PARAMETER.getMessage(FieldName.ID)))
                .verify();
    }

    @Test
    @WithUserDetails(value = "api_user")
    public void validGetApplicationById() {
        Application application = new Application();
        application.setName("validGetApplicationById-Test");
        Mono<Application> createApplication = applicationPageService.createApplication(application);
        Mono<Application> getApplication = createApplication.flatMap(t -> applicationService.getById(t.getId()));
        StepVerifier.create(getApplication)
                .assertNext(t -> {
                    assertThat(t).isNotNull();
                    assertThat(t.getId()).isNotNull();
                    assertThat(t.getName()).isEqualTo("validGetApplicationById-Test");
                })
                .verifyComplete();
    }

    @Test
    @WithUserDetails(value = "api_user")
    public void validGetApplicationsByName() {
        Application application = new Application();
        application.setName("validGetApplicationByName-Test");
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.set(FieldName.NAME, application.getName());

        Mono<Application> createApplication = applicationPageService.createApplication(application);

        Flux<Application> getApplication = createApplication.flatMapMany(t -> applicationService.get(params));
        StepVerifier.create(getApplication)
                .assertNext(t -> {
                    assertThat(t).isNotNull();
                    assertThat(t.getId()).isNotNull();
                    assertThat(t.getName()).isEqualTo("validGetApplicationByName-Test");
                })
                .verifyComplete();
    }

    @Test
    @WithUserDetails(value = "api_user")
    public void validGetApplications() {
        Application application = new Application();
        application.setName("validGetApplications-Test");

        Policy readAppPolicy = Policy.builder().permission(READ_APPLICATIONS.getValue())
                .users(Set.of("api_user"))
                .build();
        Mono<Application> createApplication = applicationPageService.createApplication(application);
        List<Application> applicationList = createApplication
                .flatMapMany(t -> applicationService.get(new LinkedMultiValueMap<>()))
                .collectList()
                .block();

        assertThat(applicationList.size() > 0);
        applicationList.forEach(t -> {
            assertThat(t.getId()).isNotNull();
            assertThat(t.getPolicies()).isNotEmpty();
            assertThat(t.getPolicies()).containsAll(Set.of(readAppPolicy));
        });
    }

    /* Tests for Update Application Flow */
    @Test
    @WithUserDetails(value = "api_user")
    public void validUpdateApplication() {
        Application application = new Application();
        application.setName("validUpdateApplication-Test");

        Mono<Application> createApplication =
                applicationPageService
                        .createApplication(application);
        Mono<Application> updateApplication = createApplication
                .map(t -> {
                    t.setName("NewValidUpdateApplication-Test");
                    return t;
                })
                .flatMap(t -> applicationService.update(t.getId(), t))
                .flatMap(t -> applicationService.getById(t.getId()));

        StepVerifier.create(updateApplication)
                .assertNext(t -> {
                    assertThat(t).isNotNull();
                    assertThat(t.getId()).isNotNull();
                    assertThat(t.getPolicies()).isNotEmpty();
                    assertThat(t.getName()).isEqualTo("NewValidUpdateApplication-Test");
                })
                .verifyComplete();
    }

    @Test
    @WithUserDetails(value = "api_user")
    public void reuseDeletedAppName() {
        Application firstApp = new Application();
        firstApp.setName("Ghost app");

        Application secondApp = new Application();
        secondApp.setName("Ghost app");

        Mono<Application> firstAppDeletion = applicationPageService
                .createApplication(firstApp)
                .flatMap(app -> applicationService.archive(app))
                .cache();

        Mono<Application> secondAppCreation = firstAppDeletion.then(
                applicationPageService.createApplication(secondApp));

        StepVerifier
                .create(Mono.zip(firstAppDeletion, secondAppCreation))
                .assertNext(tuple2 -> {
                    Application first = tuple2.getT1(), second = tuple2.getT2();
                    assertThat(first.getName()).isEqualTo("Ghost app");
                    assertThat(second.getName()).isEqualTo("Ghost app");
                    assertThat(first.isDeleted()).isTrue();
                    assertThat(second.isDeleted()).isFalse();
                })
                .verifyComplete();
    }

    @Test
    @WithUserDetails(value = "api_user")
    public void getAllApplicationsForHome() {
        Mono<List<OrganizationApplicationsDTO>> allApplications = applicationService.getAllApplications();

        StepVerifier
                .create(allApplications)
                .assertNext(organizationApplicationsDTOS -> {
                    assertThat(organizationApplicationsDTOS).isNotEmpty();

                    OrganizationApplicationsDTO orgAppDto = organizationApplicationsDTOS.get(0);
                    assertThat(orgAppDto.getOrganization().getUserPermissions().contains("read:organizations"));

                    Application application = orgAppDto.getApplications().get(0);
                    assertThat(application.getUserPermissions()).contains("read:applications");
                })
                .verifyComplete();

    }

}
