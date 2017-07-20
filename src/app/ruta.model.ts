export interface Ruta {
    id?: string;
    userEmail: string;
    userName: string;
    origin: string;
    originObject: string;
    originCity: string;
    originCoord: string[];   //JSON 
    destination: string;
    destinationCoord: string[];   //JSON 
    destinationObject: string;
    destinationCity: string;
    hour: string; //hour dept
    hourBack: string;
    weekDays: string[];  
    spaces: string; //1,2,3,4,5 or 6
    availSpacesIda: string;
    availSpacesVuelta: string;
    usersOnIda: string[]; //by email
    usersOnVuelta: string[]; //by email

}