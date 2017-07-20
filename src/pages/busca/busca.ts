import { Component } from '@angular/core';

import { NavController, ModalController, AlertController, NavParams } from 'ionic-angular';

import { Ruta } from '../../app/ruta.model';
import { RutaService } from '../../app/ruta.service';
import { RutaModalPage } from '../ruta-modal/ruta-modal';

@Component({
  selector: 'page-busca',
  templateUrl: 'busca.html'
})
export class BuscaPage {

  ruta: Ruta; //user ruta, to avoid clicking on it
  rutas: Ruta[];
  rutasInt: Ruta[]; //rutas a cargar primera ejecucion
  myUser: any;

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private rutaService: RutaService,
    private navParams: NavParams
  ) {
    rutaService.getRutas()
      .then(rutas => this.rutas = rutas);
    this.ruta = navParams.get('ruta');
    this.myUser = navParams.get('user');
    console.log(this.myUser)


    if (localStorage.getItem('toastBuscar') === null) {
      let alert = this.alertCtrl.create({
        title: 'Rutinas y rutinas...',
        subTitle: 'Puedes pulsar en la tarjeta que te interese para obtener información sobre esa rutina.<br>También puedes utilizar el buscador para filtrar el origen y destino de las rutinas que aparecen.',
        buttons: ['¡Entendido!']
      });
      alert.present();
      localStorage.setItem('toastBuscar', JSON.stringify(true));
    }
  }

  initializeRutas() {
    if (this.rutasInt != undefined) {
      this.rutas = this.rutasInt;
    } else {
      this.rutasInt = this.rutas;
      this.rutas = this.rutasInt;
    }
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeRutas();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.rutas = this.rutas.filter((ruta) => {
        if (ruta.origin.toLowerCase().indexOf(val.toLowerCase()) > -1) {
          return this;
        } else if (ruta.destination.toLowerCase().indexOf(val.toLowerCase()) > -1) {
          return this;
        }
        // return (ruta.origin.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  openRutaModal(rutaModal) {
    if (rutaModal.userEmail == this.ruta.userEmail){
      console.log("es mi ruta");
      let alert = this.alertCtrl.create({
        title: '¡Es tu ruta!',
        subTitle: 'No puedes ver información ni unirte a tu rutina.... No tendría mucho sentivo, ¿verdad?<br>Si quieres, puedes modificarla desde el menú "Mi Rutina", en la Portada.',
        buttons: ['Ok']
      });
      alert.present();
    } else{
      console.log(rutaModal)
      let modal = this.modalCtrl.create(RutaModalPage, {
        ruta: rutaModal,
        user: this.myUser
      });
      modal.present();
      }
  }
}


