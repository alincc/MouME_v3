import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ActionSheetController, LoadingController, AlertController } from 'ionic-angular';
import { User } from '../../app/user.model';
import { UserService } from '../../app/user.service';
// import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, GoogleMapsPolyline } from 'ionic-native';


@Component({
  selector: 'page-user-modal',
  templateUrl: 'user-modal.html',
})
export class UserModalPage {

  user: User;
  ruta: any;
  rating: number;

  constructor(
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private params: NavParams,
    private userService: UserService
  ) {
    this.ruta = this.params.get('ruta');
    this.user = this.params.get('user');
  }

  rateUser(){
    let alert = this.alertCtrl.create({
        title: ":'(",
        subTitle: 'Lo sentimos, esta función aún no está disponible en MouME',
        buttons: ['Ok']
      });
      alert.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  goBack() {
    this.navCtrl.pop(this.ruta);
  }

}
