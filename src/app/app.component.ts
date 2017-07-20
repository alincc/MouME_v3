import { Component, NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any;
  zone: NgZone;

  constructor(platform: Platform) {
    this.zone = new NgZone({});

    var config = {
      apiKey: "AIzaSyA9hJSb_5aQ4fJ1cKINxNTy-O2k9pTKmh4",
      authDomain: "moume-160100.firebaseapp.com",
      databaseURL: "https://moume-160100.firebaseio.com",
      storageBucket: "moume-160100.appspot.com",
      messagingSenderId: "872518634468"
    };
    firebase.initializeApp(config);

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

    this.zone = new NgZone({});
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.zone.run(() => {
        if (!user) {
          console.log("There's not a logged in user");
          this.rootPage = LoginPage;
          unsubscribe();
        } else {
          console.log("There's a logged in user");
          this.rootPage = HomePage;
          unsubscribe();
        }
      });
    });

  }
}
