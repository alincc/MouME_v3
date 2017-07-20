import { Component } from '@angular/core';
import { NavController, ToastController, NavParams } from 'ionic-angular';

import { UserService } from '../../app/user.service'

import { ProfileData } from '../../providers/profile-data';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-user-welcome',
  templateUrl: 'user-welcome.html'
})
export class UserWelcomePage {
  public user: any;
  public userEmail: string;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public userService: UserService,
    public profileData: ProfileData
  ) {
    this.userEmail = navParams.get('userEmail');
    this.user = {
      id: '',
      email: this.userEmail,
      userName: '',
      firstName: '',
      lastName: '',
      hasRuta: false,
      saldo: 20,
    }
  }

  guardarUser() {
    console.log(this.user)
    this.user.rutasOn = ["",""]
    this.userService.addUser(this.user);
    // console.log("ruta saved");
    let toast = this.toastCtrl.create({
      message: 'Usuario guardado correctamente',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
    this.navCtrl.pop(HomePage);
  }
}