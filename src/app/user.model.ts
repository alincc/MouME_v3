export interface User {
    email: string;
    userName: string;
    firstName: string;
    lastName: string;
    birthdate: string;
    sex: string;
    hasRuta: Boolean;
    telephone: string;
    saldo: number;
    rating: number[]; //first midium and then total ratings
    comments: string[];
    rutasOn: string[] //id of ruta
}