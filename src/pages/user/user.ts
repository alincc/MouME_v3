import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';

import { ProfileData } from '../../providers/profile-data';
import { AuthData } from '../../providers/auth-data';
import { UserService } from '../../app/user.service';
import { RutaService } from '../../app/ruta.service';

import { LoginPage } from '../login/login';
import { RutaPage } from '../ruta/ruta';

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {
  public userProfile: any;
  public ruta: any;

  constructor(
    public navCtrl: NavController,
    public profileData: ProfileData,
    public authData: AuthData,
    public userService: UserService,
    public rutaService: RutaService,
    public alertCtrl: AlertController,
    public navParams: NavParams,
  ) {
    this.userProfile = navParams.get('userProfile'),
      this.ruta = navParams.get('ruta')
  }

  updateName() {
    let alert = this.alertCtrl.create({
      message: "Nombre y apellidos",
      inputs: [
        {
          name: 'firstName',
          placeholder: 'Nombre',
          value: this.userProfile.firstName
        },
        {
          name: 'lastName',
          placeholder: 'Apellidos',
          value: this.userProfile.lastName
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Guardar',
          handler: data => {
            this.userProfile.firstName = data.firstName;
            this.userProfile.lastName = data.lastName;
            this.userService.setUser(this.userProfile.email, this.userProfile)
          }
        }
      ]
    });
    alert.present();
  }

  updateUserName() {
    let alert = this.alertCtrl.create({
      message: "Nombre de usuario",
      inputs: [
        {
          name: 'userName',
          placeholder: 'Visible para otros usuarios',
          value: this.userProfile.userName
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Guardar',
          handler: data => {
            this.userProfile.userName = data.userName;
            this.userService.setUser(this.userProfile.email, this.userProfile)
          }
        }
      ]
    });
    alert.present();
  }

  updateEmail() {
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'email',
          placeholder: 'Nuevo correo electrónico',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Guardar',
          handler: data => {
            this.userProfile.email = data.email;
            this.userService.setUser(this.userProfile.email, this.userProfile)
          }
        }
      ]
    });
    alert.present();
  }

  updatePassword() {
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newPassword',
          placeholder: 'Nueva contraseña',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Guardar',
          handler: data => {
            this.profileData.updatePassword(data.newPassword);
          }
        }
      ]
    });
    alert.present();
  }

  darmeDeBajaRutas() {
    if ((this.userProfile.rutasOn[0] != "") || (this.userProfile.rutasOn[1] != "")) {
      this.rutaService.getRutas()
        .then(rutas => {
          let rutasTemp = rutas;
          let messageRutas = "";
          for (let i = 0; i < rutasTemp.length; i++) {
            if (rutasTemp[i].id == this.userProfile.rutasOn[0]) {
              messageRutas += "<br>Ida: " + rutasTemp[i].origin + " - " + rutasTemp[i].destination + "<br>";
              rutasTemp[i].availSpacesIda = (Number(rutasTemp[i].availSpacesIda) + 1).toString();
              this.rutaService.setRuta(rutasTemp[i].userEmail, rutasTemp[i]);
            } else if (rutasTemp[i].id == this.userProfile.rutasOn[1]) {
              messageRutas += "<br>Vuelta: " + rutasTemp[i].origin + " - " + rutasTemp[i].destination + "<br>";
              rutasTemp[i].availSpacesVuelta = (Number(rutasTemp[i].availSpacesVuelta) + 1).toString();
              this.rutaService.setRuta(rutasTemp[i].userEmail, rutasTemp[i])
            }
          }
          this.userProfile.rutasOn = ["", ""];
          this.userService.setUser(this.userProfile.email, this.userProfile);
          let alert = this.alertCtrl.create({
            title: "¡Hecho!",
            subTitle: "Te hemos dado de baja de las siguientes rutinas:<br>" + messageRutas,
            buttons: [
              {
                text: 'Ok',
              }
            ]
          });
          alert.present();
        })
    } else {
      let alert = this.alertCtrl.create({
        title: "Ups!",
        subTitle: "Parece que no te has unido a ninguna rutina, por lo que no te podemos dar de baja de ellas",
        buttons: [
          {
            text: 'Ok',
          }
        ]
      });
      alert.present();
    }
  }

  recargarSaldo() {
    let alert = this.alertCtrl.create({
      title: "Ups!",
      subTitle: "Función no disponible por el momento :(",
      buttons: [
        {
          text: 'Ok',
        }
      ]
    });
    alert.present();
  }

  goToRuta() {
    this.navCtrl.push(RutaPage, {
      ruta: this.ruta,
      userProfile: this.userProfile,
    });
  }

  ponerRutaFalse() {
    this.profileData.updateHasRuta(false)
  }

  logMeOut() {
    this.authData.logoutUser().then(() => {
      this.navCtrl.setRoot(LoginPage, {}, { animate: true, direction: 'forward' });
    });
  }
}