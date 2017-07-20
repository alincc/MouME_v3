import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class ProfileData {
  public userProfile: any;
  public currentUser: any;


  constructor() {
    this.currentUser = firebase.auth().currentUser;
    this.userProfile = firebase.database().ref('/userProfile');
  }

  getUserProfile(): any {
    return this.userProfile.child(this.currentUser.uid);
  }

  updateName(firstName: string, lastName: string): any {
    return this.userProfile.child(this.currentUser.uid).update({
      firstName: firstName,
      lastName: lastName,
    });
  }

  updateDOB(birthDate: string): any {
    return this.userProfile.child(this.currentUser.uid).update({
      birthDate: birthDate,
    });
  }

  updateEmail(newEmail: string): any {
    this.currentUser.updateEmail(newEmail).then(() => {
      this.userProfile.child(this.currentUser.uid).update({
        email: newEmail
      });
    }, (error) => {
      console.log(error);
    });
  }

  updateUserName(newUserName: string): any {
      this.userProfile.child(this.currentUser.uid).update({
        userName: newUserName
    }, (error) => {
      console.log(error);
    });
  }

  updatePassword(newPassword: string): any {
    this.currentUser.updatePassword(newPassword).then(() => {
      console.log("Password Changed");
    }, (error) => {
      console.log(error);
    });
  }

  updateTokens(newTokens: number): any {
    if (newTokens > 30) {
      return false;
    } else {
      return this.userProfile.child(this.currentUser.uid).update({
        tokens: newTokens,
      });
    }
  }

  updateHasRuta(newHasRuta: boolean): any {
    return this.userProfile.child(this.currentUser.uid).update({
      hasRuta: newHasRuta,
    });
  }

  updateRutaId(rutaID: string) {
    return this.userProfile.child(this.currentUser.uid).update({
      rutaID: rutaID,
    });
  }

}
