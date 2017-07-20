import { Component } from '@angular/core';
import { NavController, Platform, LoadingController, MenuController, ModalController, PopoverController, ToastController, AlertController } from 'ionic-angular';
import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, GoogleMapsPolyline, GoogleMapsMarker } from 'ionic-native';

//pages
import { TourPage } from '../tour/tour';
import { UserWelcomePage } from '../user-welcome/user-welcome'
import { UserPage } from '../user/user';
import { RutaPage } from '../ruta/ruta';
import { BuscaPage } from '../busca/busca';
import { RutaModalPage } from '../ruta-modal/ruta-modal';
import { ProfileData } from '../../providers/profile-data';
import { RutaService } from '../../app/ruta.service';
import { UserService } from '../../app/user.service'

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {

  map: GoogleMap;
  loading: any;
  userProfile: any;
  ruta: any;
  rutas: any;
  polylines: any[];
  markers: any[];
  loader: Boolean;
  filterOptions: any;
  clickable: any;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public platform: Platform,
    public profileData: ProfileData,
    public rutaService: RutaService,
    public userService: UserService
  ) {
    this.loader = true;
    this.clickable = true;
    // this.loader = false;
    // this.clickable = false;

    this.filterOptions = {
      miRuta: true,
      otrasRutas: true,
      origin: '',
      destination: '',
    }

    platform.ready().then(() => {
      // this.rutas = this.rutaService.getRutas();
    })
  }

  //check
  ionViewWillEnter() {
    if (localStorage.getItem('tour') === null) {
      this.navCtrl.push(TourPage)
      localStorage.setItem('tour', JSON.stringify(true));
    } else {
      this.cargaDatos();
    }

  }

  cargaDatos() {

    this.presentLoading(this.loader);

    this.profileData.getUserProfile().on('value', (data) => {
      let userEmail = data.val().email;
      this.userService.getUser(userEmail)
        .then(user => {
          this.userProfile = user;
          if (this.userProfile == undefined) {
            // this.presentToast("user undefined")
            this.navCtrl.push(UserWelcomePage, {
              userEmail: userEmail,
            });
          } else {
            // this.presentToast("user defined")
            this.rutaService.getRutas()
              .then(rutas => {
                this.rutas = rutas;
                if (this.userProfile.hasRuta) {
                  // this.presentToast("user has ruta")
                  this.rutaService.getRuta(this.userProfile.email)
                    .then(ruta => {
                      this.ruta = ruta;
                      this.loadMap();
                    });
                }
                else {
                  // this.presentToast("user has not ruta")
                  this.ruta = {
                    userEmail: this.userProfile.email, userName: this.userProfile.userName, origin: '', destination: '', originObject: '', destinationObject: '', originCoord: [], destinationCoord: [], originCity: '', destinationCity: '', hour: '', hourBack: '', weekDays: [], spaces: "", availSpaces: "", usersOn: [""]
                  }
                  this.loadMap();
                }
              })
          }
        })
    })
  }


  loadMap() {

    let location = new GoogleMapsLatLng(41.4038422, 2.1935186);

    this.map = new GoogleMap('map', {
      'backgroundColor': 'white',
      'controls': {
        'compass': true,
        'myLocationButton': true,
        'indoorPicker': false,
        'zoom': false,
        'mapToolbar': true
      },
      'gestures': {
        'scroll': true,
        'tilt': true,
        'rotate': true,
        'zoom': true
      },
      'camera': {
        'latLng': location,
        // 'tilt': 15,
        'zoom': 13,
        //'bearing': 50
      },
      'preferences': {
        'zoom': {
          'minZoom': 10,
          'maxZoom': 15
        },
      }
    });

    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
      this.dibujaRutas();
    });
  }

  setMapClickable(value) {
    if (this.clickable) {
      this.map.setClickable(value);
    }
  }

  dibujaRutas() {

    this.map.clear();

    for (var i = 0; i < this.rutas.length; i++) {

      //para poder pasar a funciones:
      let rutaActual = this.rutas[i];

      let originPoint = new GoogleMapsLatLng(rutaActual.originCoord[0], rutaActual.originCoord[1]);
      let destinationPoint = new GoogleMapsLatLng(rutaActual.destinationCoord[0], rutaActual.destinationCoord[1]);
      let markerLat = ((Number(rutaActual.originCoord[0]) + Number(rutaActual.destinationCoord[0])) / 2);
      let markerLng = ((Number(rutaActual.originCoord[1]) + Number(rutaActual.destinationCoord[1])) / 2);

      if (rutaActual.id == this.ruta.id) { //if ruta es nuestra
        this.map.addPolyline({
          points: [originPoint, destinationPoint],
          color: '#1b7cf5', //roig
          width: 4,
          geodesic: true
        })
          .then((polyline: GoogleMapsPolyline) => this.polylines[i] = polyline);
      } else { //ruta no es nuestra
        this.map.addPolyline({
          points: [originPoint, destinationPoint],
          color: '#f02d2d', //blau
          width: 4,
          geodesic: true,
        })
          .then((polyline) => {
            this.polylines[i] = polyline;
          });
        this.map.addMarker({
          position: new GoogleMapsLatLng(markerLat, markerLng),
          disableAutoPan: true,
          'title': ["Origen: ", rutaActual.origin, "\nDestino: ", rutaActual.destination].join(""),
          'snippet': 'Pulsa para más información',
          "styles": {
            "maxWidth": "80%",
          }
        })
          .then((marker: GoogleMapsMarker) => {
            marker.addEventListener(GoogleMapsEvent.INFO_CLICK).subscribe(() => {
              this.openRutaModal(rutaActual);
              // this.openRutaModal(this.ruta)
            })
          });
      }
    }

    //ocultem loader
    this.hideLoading(this.loader);
  }

  applyFilter() {
    console.log("filterOptions");
    console.log(this.filterOptions);

    this.rutaService.getRutas()
      .then(rutas => {
        this.rutas = rutas;

        this.map.clear();
        for (var i = 0; i < this.rutas.length; i++) {

          //para poder pasar a funciones:
          let rutaActual = this.rutas[i];

          let originPoint = new GoogleMapsLatLng(rutaActual.originCoord[0], rutaActual.originCoord[1]);
          let destinationPoint = new GoogleMapsLatLng(rutaActual.destinationCoord[0], rutaActual.destinationCoord[1]);
          let markerLat = ((Number(rutaActual.originCoord[0]) + Number(rutaActual.destinationCoord[0])) / 2);
          let markerLng = ((Number(rutaActual.originCoord[1]) + Number(rutaActual.destinationCoord[1])) / 2);

          if ((this.filterOptions.origin.toLowerCase() != '') && (this.filterOptions.destination.toLowerCase() == '')) {
            //filtramos SOLO por origen

            if (rutaActual.origin.toLowerCase().indexOf(this.filterOptions.origin.toLowerCase()) > -1) {
              if (rutaActual.id == this.ruta.id) {        //if ruta es nuestra
                if (this.filterOptions.miRuta == true) {  //filter
                  this.map.addPolyline({
                    points: [originPoint, destinationPoint],
                    color: '#1b7cf5', //roig
                    width: 4,
                    geodesic: true
                  })
                    .then((polyline: GoogleMapsPolyline) => this.polylines[i] = polyline);
                }
              } else {                                          //ruta no es nuestra
                if (this.filterOptions.otrasRutas == true) {    //filter
                  this.map.addPolyline({
                    points: [originPoint, destinationPoint],
                    color: '#f02d2d', //blau
                    width: 4,
                    geodesic: true,
                  })
                    .then((polyline: GoogleMapsPolyline) => {
                      this.polylines[i] = polyline;
                    });
                  this.map.addMarker({
                    position: new GoogleMapsLatLng(markerLat, markerLng),
                    disableAutoPan: true,
                    'title': ["Origen: ", rutaActual.origin, "\nDestino: ", rutaActual.destination].join(""),
                    'snippet': 'Pulsa para más información',
                    "styles": {
                      "maxWidth": "80%",
                    }
                  })
                    .then((marker: GoogleMapsMarker) => {
                      this.markers[i] = marker;
                      marker.addEventListener(GoogleMapsEvent.INFO_CLICK).subscribe(() => {
                        this.openRutaModal(rutaActual);
                        // this.openRutaModal(this.ruta)
                      })
                    });
                }
              }
            }

          } else if ((this.filterOptions.origin.toLowerCase() == '') && (this.filterOptions.destination.toLowerCase() != '')) {
            //filtramos SOLO por destino

            if (rutaActual.destination.toLowerCase().indexOf(this.filterOptions.destination.toLowerCase()) > -1) {
              if (rutaActual.id == this.ruta.id) {        //if ruta es nuestra
                if (this.filterOptions.miRuta == true) {  //filter
                  this.map.addPolyline({
                    points: [originPoint, destinationPoint],
                    color: '#1b7cf5', //roig
                    width: 4,
                    geodesic: true
                  })
                    .then((polyline: GoogleMapsPolyline) => this.polylines[i] = polyline);
                }
              } else {                                          //ruta no es nuestra
                if (this.filterOptions.otrasRutas == true) {    //filter
                  this.map.addPolyline({
                    points: [originPoint, destinationPoint],
                    color: '#f02d2d', //blau
                    width: 4,
                    geodesic: true,
                  })
                    .then((polyline: GoogleMapsPolyline) => {
                      this.polylines[i] = polyline;
                    });
                  this.map.addMarker({
                    position: new GoogleMapsLatLng(markerLat, markerLng),
                    disableAutoPan: true,
                    'title': ["Origen: ", rutaActual.origin, "\nDestino: ", rutaActual.destination].join(""),
                    'snippet': 'Pulsa para más información',
                    "styles": {
                      "maxWidth": "80%",
                    }
                  })
                    .then((marker: GoogleMapsMarker) => {
                      this.markers[i] = marker;
                      marker.addEventListener(GoogleMapsEvent.INFO_CLICK).subscribe(() => {
                        this.openRutaModal(rutaActual);
                        // this.openRutaModal(this.ruta)
                      })
                    });
                }
              }
            }

          } else if ((this.filterOptions.origin.toLowerCase() != '') && (this.filterOptions.destination.toLowerCase() != '')) {
            //filtramos por origen y destino

            if ((rutaActual.origin.toLowerCase().indexOf(this.filterOptions.origin.toLowerCase()) > -1) || (rutaActual.destination.toLowerCase().indexOf(this.filterOptions.destination.toLowerCase()) > -1)) {
              if (rutaActual.id == this.ruta.id) {        //if ruta es nuestra
                if (this.filterOptions.miRuta == true) {  //filter
                  this.map.addPolyline({
                    points: [originPoint, destinationPoint],
                    color: '#1b7cf5', //roig
                    width: 4,
                    geodesic: true
                  })
                    .then((polyline: GoogleMapsPolyline) => this.polylines[i] = polyline);
                }
              } else {                                          //ruta no es nuestra
                if (this.filterOptions.otrasRutas == true) {    //filter
                  this.map.addPolyline({
                    points: [originPoint, destinationPoint],
                    color: '#f02d2d', //blau
                    width: 4,
                    geodesic: true,
                  })
                    .then((polyline: GoogleMapsPolyline) => {
                      this.polylines[i] = polyline;
                    });
                  this.map.addMarker({
                    position: new GoogleMapsLatLng(markerLat, markerLng),
                    disableAutoPan: true,
                    'title': ["Origen: ", rutaActual.origin, "\nDestino: ", rutaActual.destination].join(""),
                    'snippet': 'Pulsa para más información',
                    "styles": {
                      "maxWidth": "80%",
                    }
                  })
                    .then((marker: GoogleMapsMarker) => {
                      this.markers[i] = marker;
                      marker.addEventListener(GoogleMapsEvent.INFO_CLICK).subscribe(() => {
                        this.openRutaModal(rutaActual);
                        // this.openRutaModal(this.ruta)
                      })
                    });
                }
              }
            }
          } else {
            //no filtramos por origien ni destino

            if (rutaActual.id == this.ruta.id) {        //if ruta es nuestra
              if (this.filterOptions.miRuta == true) {  //filter
                this.map.addPolyline({
                  points: [originPoint, destinationPoint],
                  color: '#1b7cf5', //roig
                  width: 4,
                  geodesic: true
                })
                  .then((polyline: GoogleMapsPolyline) => this.polylines[i] = polyline);
              }
            } else {                                          //ruta no es nuestra
              if (this.filterOptions.otrasRutas == true) {    //filter
                this.map.addPolyline({
                  points: [originPoint, destinationPoint],
                  color: '#f02d2d', //blau
                  width: 4,
                  geodesic: true,
                })
                  .then((polyline: GoogleMapsPolyline) => {
                    this.polylines[i] = polyline;
                  });
                this.map.addMarker({
                  position: new GoogleMapsLatLng(markerLat, markerLng),
                  disableAutoPan: true,
                  'title': ["Origen: ", rutaActual.origin, "\nDestino: ", rutaActual.destination].join(""),
                  'snippet': 'Pulsa para más información',
                  "styles": {
                    "maxWidth": "80%",
                  }
                })
                  .then((marker: GoogleMapsMarker) => {
                    this.markers[i] = marker;
                    marker.addEventListener(GoogleMapsEvent.INFO_CLICK).subscribe(() => {
                      this.openRutaModal(rutaActual);
                      // this.openRutaModal(this.ruta)
                    })
                  });
              }
            }

          }

        }

      })

    this.toggleFilter();
  }

  //hack
  botonAbreRuta() {
    this.openRutaModal(this.ruta);
  }

  openRutaModal(rutaModal) {
    console.log(rutaModal)
    let modal = this.modalCtrl.create(RutaModalPage, {
      ruta: rutaModal,
      user: this.userProfile
    });
    this.setMapClickable(false);
    modal.present();
    modal.onDidDismiss(() => {
      this.setMapClickable(true);
    })
  }

  menuClosed() {
    this.setMapClickable(true);
  }

  menuOpened() {
    this.setMapClickable(false);
  }

  toggleFilter() {
    this.menuCtrl.toggle("rightFilter").then(() => {
      if (this.menuCtrl.isOpen()) {
        this.setMapClickable(false);
      } else {
        this.setMapClickable(true);
      }
    })
  }

  toggleMenu() {
    this.menuCtrl.toggle("leftMenu").then(() => {
      if (this.menuCtrl.isOpen()) {
        this.setMapClickable(false);
      } else {
        this.setMapClickable(true);
      }
    });
  }

  pushToUser() {
    this.navCtrl.push(UserPage, {
      ruta: this.ruta,
      userProfile: this.userProfile,
    });
    this.setMapClickable(true);
  }

  pushRutaPage() {
    this.navCtrl.push(RutaPage, {
      ruta: this.ruta,
      userProfile: this.userProfile,
    });
    this.setMapClickable(true);
    console.log("ruta pushed")
  }

  pushBuscaPage() {
    this.navCtrl.push(BuscaPage, {
      ruta: this.ruta,
      user: this.userProfile
    });
    this.setMapClickable(true);
  }

  pushTourPage() {
    this.navCtrl.push(TourPage);
    this.setMapClickable(true);
  }

  pushAvisoLegal() {
    // this.navCtrl.push(TourPage);
    // this.setMapClickable(true);
  }

  presentLoading(loader) {
    if (loader) {
      this.loading = this.loadingCtrl.create({
        content: "Por favor, espera...",
        dismissOnPageChange: true
      });
      this.loading.present();
    }
  }

  hideLoading(loader) {
    if (loader) {
      this.loading.dismiss();
    }
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }

  abreAlertAvisoLegal() {
    let alert = this.alertCtrl.create({
      title: 'Aviso Legal',
      subTitle: 'Usando MouME aceptas las siguientes condiciones:',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nulla tortor, malesuada quis ante ac, lacinia dictum turpis. Quisque ornare sem elit, eu vulputate ligula mattis non. Etiam bibendum egestas quam, non pharetra mi ultrices vulputate. Praesent tristique sapien eu lorem aliquam porta. Nunc gravida leo vel eros mattis porta in sit amet libero. Donec suscipit, nulla ut dictum cursus, elit lectus bibendum nunc, nec convallis nunc purus vel lacus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus efficitur imperdiet euismod. Suspendisse nec interdum turpis. Etiam faucibus euismod metus, eu faucibus neque facilisis ac. Donec porttitor interdum pulvinar. Ut eget gravida libero. Vestibulum porttitor iaculis sem, vel vestibulum nulla feugiat quis.<br><br>Fusce hendrerit lacinia ultrices. Donec quis massa velit. Suspendisse suscipit ligula risus, vel lacinia ipsum porta non. Pellentesque sagittis ex ac nisl porta imperdiet. Etiam sit amet dui et felis fermentum tincidunt ut et nibh. Integer diam quam, blandit id lorem et, auctor luctus sapien. Nunc at nulla pulvinar, faucibus augue eu, vehicula quam. Etiam luctus, diam sit amet accumsan vehicula, turpis nisl dapibus mi, a convallis justo dolor eu nulla.<br><br>Vestibulum sed sem a arcu laoreet mollis ut in magna. Etiam cursus scelerisque mauris, quis fringilla mi ultricies nec. In ac diam tristique, auctor magna et, dapibus nisi. Integer at posuere est. Maecenas vel eros mauris. Curabitur vulputate vitae erat tempor dignissim. Cras vitae nunc felis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer at orci vulputate, facilisis leo ac, sollicitudin leo. Morbi porta est porta tincidunt tristique. Phasellus tempus commodo laoreet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus in vestibulum massa. In malesuada metus ipsum, non molestie augue lacinia sed. Phasellus molestie pulvinar elit sed tempor. Suspendisse semper quis augue sed dignissim.<br><br>Morbi vestibulum lacus eget feugiat sodales. Sed at justo auctor, vulputate justo vitae, sagittis nibh. Nunc sed posuere eros, at malesuada felis. Nunc eget tempor nunc. Sed risus nisl, hendrerit sit amet lacinia sollicitudin, tempor at nunc. Quisque fringilla ex non magna tincidunt sodales. Cras pulvinar aliquet mollis. Aenean viverra risus in ultricies laoreet. Nulla in viverra quam. Maecenas molestie consectetur lectus, vel convallis libero posuere in. Nunc vitae bibendum arcu. Donec vitae velit orci.<br>Pellentesque ornare scelerisque eros. Duis id libero vel lacus tempus dapibus. Mauris tincidunt orci nisi, sit amet pulvinar nulla tempus non. Sed malesuada justo vitae ex posuere, vel scelerisque mauris fringilla. Donec volutpat suscipit dui, ut gravida ex elementum quis. Proin elementum posuere elit, vitae rhoncus diam aliquet ut. Duis tempus sit amet lorem iaculis dictum. Vestibulum nec sagittis dolor. Proin tellus nunc, mattis at dictum at, lobortis vel erat. Suspendisse eget dui tellus. Donec venenatis sapien dui, non tempus massa eleifend at. Fusce convallis arcu nec ex vestibulum consequat. Pellentesque tincidunt, orci in sollicitudin finibus, enim ex tempor nisi, sed tincidunt justo ligula vel tortor. Integer non erat ullamcorper sem condimentum lobortis sed malesuada ex. Maecenas eleifend feugiat felis, porttitor suscipit urna tincidunt in.',
      buttons: ['Ok']
    });
    alert.present(() => {
      this.toggleMenu()
      this.setMapClickable(false);
    });
    alert.onDidDismiss(() => {
      this.setMapClickable(true);
    })
  }
}