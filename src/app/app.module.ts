import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AgmCoreModule } from 'angular2-google-maps/core';

import { AuthData } from '../providers/auth-data';
import { ProfileData } from '../providers/profile-data';
import { RutaService } from './ruta.service';
import { UserService } from './user.service';

//pages
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { UserPage } from '../pages/user/user';
import { RutaPage } from '../pages/ruta/ruta';
import { TourPage } from '../pages/tour/tour'; 
import { BuscaPage } from '../pages/busca/busca'; 
import { RutaModalPage } from '../pages/ruta-modal/ruta-modal';
import { UserModalPage } from '../pages/user-modal/user-modal';
import { UserWelcomePage } from '../pages/user-welcome/user-welcome'; 

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    UserPage,
    RutaPage,
    TourPage,
    BuscaPage,
    RutaModalPage,
    UserModalPage,
    UserWelcomePage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD8Ja5HNf6AhokCS4wi-_BrY0cLg9pSvzo',
      libraries: ['places'],
      region: "ES",
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    UserPage,
    RutaPage,
    BuscaPage,
    TourPage,
    RutaModalPage,
    UserModalPage,
    UserWelcomePage
  ],
  providers: [
    AuthData,
    ProfileData,
    RutaService,
    UserService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
