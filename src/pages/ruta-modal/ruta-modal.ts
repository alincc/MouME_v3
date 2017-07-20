import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ActionSheetController, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { Ruta } from '../../app/ruta.model';
import { RutaService } from '../../app/ruta.service';
import { UserService } from '../../app/user.service';
import { UserModalPage } from '../user-modal/user-modal'
// import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, GoogleMapsPolyline } from 'ionic-native';


@Component({
  selector: 'page-ruta-modal',
  templateUrl: 'ruta-modal.html',
})
export class RutaModalPage {

  ruta: Ruta;
  user: any;
  myUser: any;
  disponibleIda: Boolean;
  disponibleVuelta: Boolean;

  constructor(
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private params: NavParams,
    private rutaService: RutaService,
    private userService: UserService
  ) {
    this.myUser = this.params.get('user');
    this.ruta = this.params.get('ruta');
    
    if (parseInt(this.ruta.availSpacesIda) > 0) {
      this.disponibleIda = true;
    } else {
      this.disponibleIda = false;
    }
    if (parseInt(this.ruta.availSpacesVuelta) > 0) {
      this.disponibleVuelta = true;
    } else {
      this.disponibleVuelta = false;
    }
  }

  unirseRutaIda() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Únete a la ida',
      buttons: [
        {
          text: 'Un día / 0.50€',
          handler: () => {
            this.handleIda(0.5);
          }
        }, {
          text: 'Una semana / 2€',
          handler: () => {
            this.handleIda(2);
          }
        }, {
          text: 'Un mes / 6€',
          handler: () => {
            this.handleIda(6);
          }
        }
      ]
    });
    actionSheet.present();
  }

  unirseRutaVuelta() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Únete a la vuelta',
      buttons: [
        {
          text: 'Un día / 0.50€',
          handler: () => {
            this.handleVuelta();
          }
        }, {
          text: 'Una semana / 2€',
          handler: () => {
            this.handleVuelta();
          }
        }, {
          text: 'Un mes / 6€',
          handler: () => {
            this.handleVuelta();
          }
        }
      ]
    });
    actionSheet.present();
  }

  handleIda(num) {
    let loading = this.loadingCtrl.create({
      content: "Por favor, espera...",
    });
    loading.present();
    if (this.myUser.rutasOn[0] != "") {
      loading.dismiss()
      this.showErrorMessage()
    } else{
      this.ruta.availSpacesIda = (Number(this.ruta.availSpacesIda) - 1).toString();
      this.ruta.usersOnIda[this.ruta.usersOnIda.length] = this.myUser.email;
      this.rutaService.setRuta(this.ruta.userEmail, this.ruta)
        .then(() => {
          this.myUser.rutasOn[0] = this.ruta.id;
          this.userService.setUser(this.myUser.email, this.myUser)
            .then(() => {
              loading.dismiss()
              this.showConfirmationMessage();
            })
        })
    }
    
  }

  handleVuelta() {
    let loading = this.loadingCtrl.create({
      content: "Por favor, espera...",
    });
    loading.present();
    if (this.myUser.rutasOn[1] != "") {
      loading.dismiss()
      this.showErrorMessage()
    } else{
      this.ruta.availSpacesVuelta = (Number(this.ruta.availSpacesVuelta) - 1).toString();
      this.ruta.usersOnVuelta[this.ruta.usersOnVuelta.length] = this.myUser.email;
      this.rutaService.setRuta(this.ruta.userEmail, this.ruta)
        .then(() => {
          this.myUser.rutasOn[1] = this.ruta.id;
          this.userService.setUser(this.myUser.email, this.myUser)
            .then(() => {
              loading.dismiss()
              this.showConfirmationMessage();
            })
        })
    }
  }

  showErrorMessage(){
    let alert = this.alertCtrl.create({
      title: '¡Ups!',
      message: 'Vaya, parece que algo ha ido mal. Recuerda que solo puedes estar apuntado a una ruta de ida y una de vuelta.',
      buttons: ['Ok']
    });
    alert.present();
  }

  showConfirmationMessage() {
    let alert = this.alertCtrl.create({
      title: '¡Plaza reservada!',
      message: 'Hecho, hemos contactado con ' + this.ruta.userName + " y le hemos pasado tu contacto. Deberás esperar a que confirme tu plaza.<br><br>Si quieres, puedes contactar con él enviándole un correo a " + this.ruta.userEmail + ". <br><br>Esperamos que disfrutes de tu experiencia MouME :)",
      buttons: ['Ok']
    });
    alert.present();
  }

  openUserModal() {
    console.log(this.ruta.userEmail)
    this.userService.getUser(this.ruta.userEmail)
    .then(user => {
      console.log(user)
      let modal = this.modalCtrl.create(UserModalPage, {
        ruta: this.ruta,
        user: user,
      });
      modal.present();
    })
    
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  goBack() {
    this.navCtrl.pop(this.ruta);
  }

}
