import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// import { KeycloakService } from 'keycloak-angular';
// import { AuthGuard } from './core/auth/auth.guard';
import { provideHttpClient } from '@angular/common/http';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    // AuthGuard,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializeKeycloak,
    //   multi: true,
    //   deps: [KeycloakService],
    // },
    // KeycloakService,
  ],
};

// function initializeKeycloak(keycloak: KeycloakService) {
//   return () =>
//     keycloak.init({
//       config: {
//         url: environment.keycloakConfig.url,
//         realm: environment.keycloakConfig.realm,
//         clientId: environment.keycloakConfig.clientId,
//       },
//       initOptions: {
//         onLoad: 'check-sso',
//         checkLoginIframe: false,
//       },
//     });
// }
