import { Component, NgZone } from '@angular/core';
import { NavController, AlertController, NavParams, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { Ruta } from '../../app/ruta.model';
import { RutaService } from '../../app/ruta.service';
import { MapsAPILoader } from 'angular2-google-maps/core';
declare var google: any;

import { UserService } from '../../app/user.service';


@Component({
  selector: 'page-ruta',
  templateUrl: 'ruta.html',
})
export class RutaPage {

  ruta: Ruta;
  rutaTemp: Ruta;
  public user: any;
  map: any;
  rutaActiva: boolean = true;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private navParams: NavParams,
    private rutaService: RutaService,
    private userService: UserService,
    private mapsLoader: MapsAPILoader,
    private loadingCtrl: LoadingController,
    private zone: NgZone
  ) {
    this.user = navParams.get('userProfile');
    this.ruta = navParams.get('ruta');

    this.autocomplete();
  }

  autocomplete() {
    this.mapsLoader.load().then(() => {
      let autocompleteOrigin = new google.maps.places.Autocomplete(document.getElementById('origin').getElementsByTagName('input')[0], {});
      google.maps.event.addListener(autocompleteOrigin, 'place_changed', () => {
        let place = autocompleteOrigin.getPlace();
        this.ruta.originObject = JSON.stringify(place);
        console.log(place)
      });
      let autocompleteDestination = new google.maps.places.Autocomplete(document.getElementById('destination').getElementsByTagName('input')[0], {});
      google.maps.event.addListener(autocompleteDestination, 'place_changed', () => {
        let place = autocompleteDestination.getPlace();
        this.ruta.destinationObject = JSON.stringify(place);
        console.log(place);
      });
    });
  }

  //IMPLEMENT POLYLINE BEFORE SAVING
  guardarRuta() {
    let origin = JSON.parse(this.ruta.originObject);
    let destination = JSON.parse(this.ruta.destinationObject);
    console.log(this.ruta);
    for (var i=0; i<origin.address_components.length; i++){
      if ((origin.address_components[i].types[0] == "locality")) {
        this.ruta.originCity = origin.address_components[i].long_name;
        break;
      }
    }
    for (var i=0; i<destination.address_components.length; i++){
      if ((destination.address_components[i].types[0] == "locality")) {
        this.ruta.destinationCity = destination.address_components[i].long_name;
        break;
      }
    }
    this.ruta.origin = origin.name + ", " + this.ruta.originCity;
    this.ruta.destination = destination.name + ", " + this.ruta.destinationCity;
    this.ruta.originCoord = [origin.geometry.location.lat, origin.geometry.location.lng];
    this.ruta.destinationCoord = [destination.geometry.location.lat, destination.geometry.location.lng];
    this.ruta.availSpacesIda = this.ruta.spaces;
    this.ruta.availSpacesVuelta = this.ruta.spaces;
    this.ruta.userName = this.user.displayName;
    console.log("ciudad origen: " + this.ruta.originCity + ", ciudad destino: " + this.ruta.destinationCity);
    if (this.ruta.id) {
      this.rutaService.setRuta(this.user.email, this.ruta);
      // console.log("ruta saved");
      let toast = this.toastCtrl.create({
        message: 'Rutina actualizada correctamente',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    } else {
      this.ruta.userEmail = this.user.email;
      this.ruta.userName = this.user.userName;
      this.rutaService.addRuta(this.ruta);
      // console.log("ruta added");
      this.user.hasRuta = true;
      this.userService.setUser(this.user.email, this.user);
      let toast = this.toastCtrl.create({
        message: 'Rutina añadida correctamente',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
    this.navCtrl.pop(this.ruta);
  }

  eliminarRuta() {
    let confirm = this.alertCtrl.create({
      title: 'Seguro que quieres elminar tu ruta?',
      message: 'Si eliminas esta ruta, también eliminarás a los usuarios que estén suscritos en ella. ¿Estás de acuerdo?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Agree clicked, deleting ruta...');

            this.rutaService.deleteRuta(this.user.email);
            this.user.hasRuta = false;
            this.userService.setUser(this.user.email, this.user);
            this.user.hasRuta = false;
            this.ruta = {
              userEmail: this.user.email, userName: this.user.userName, origin: '', destination: '', originObject: '', destinationObject: '', originCoord: [], destinationCoord: [], originCity: '', destinationCity: '', hour: '', hourBack: '', weekDays: [], spaces: "", availSpacesIda: "", availSpacesVuelta: "", usersOnIda: [], usersOnVuelta: []
            }
            let toast = this.toastCtrl.create({
              message: 'Rutina eliminada correctamente',
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
            this.navCtrl.pop(this.ruta);
          }
        }
      ]
    });
    confirm.present();
  }

  goBack() {
    this.navCtrl.pop(this.ruta);
  }


  //TO DO OK
  // calcularRuta() {
  //   let loader = this.loadingCtrl.create({
  //     content: "Calculando ruta..."
  //   })
  //   loader.present();
  //   var directionsService = new google.maps.DirectionsService();
  //   var request = {
  //     origin: { lat: this.ruta.originLat, lng: this.ruta.originLng },
  //     destination: { lat: this.ruta.destinationLat, lng: this.ruta.destinationLng },
  //     travelMode: 'DRIVING'
  //   };
  //   directionsService.route(request, function (response, status) {
  //     if (status == 'OK') {
  //       console.log("OK: ");
  //       console.log(response);
  //       // let route = response.routes[0];
  //       // console.log(route);
  //       // console.log(route.overview_path)
  //       this.ruta.object = response.json();
  //       // this.ruta.duration = route.legs[0].duration.value;
  //       loader.dismiss();
  //       this.guardarRuta();
  //     } else {
  //       console.log("KO: " + status);
  //       loader.dismiss();
  //       let alert = this.alertCtrl.create({
  //         title: 'Error',
  //         subTitle: 'Ha habido un error con tu rutina. ¿Seguro que tienes conexión a internet?',
  //         buttons: ['Ok']
  //       });
  //       alert.present();
  //     }
  //   });
  // }

}
