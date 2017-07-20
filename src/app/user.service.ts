import Dexie from 'dexie';
import { User } from './user.model';

export class UserService extends Dexie {

    users: Dexie.Table<User, string>;
    usersToAdd: User[] = [
        {
            email: "juanantonio.sanchez@gmail.com",
            userName: "juananAnt",
            firstName: "Juan Antonio",
            lastName: "Sánchez Pijuán",
            birthdate: "20-09-2003",
            sex: "male",
            hasRuta: true,
            saldo: 30,
            telephone: "617045823",
            rating: [4.6, 5],
            comments: ["Puntual y muy agradable, 100% recomendado"],
            rutasOn: ["",""]
        },
        {
            email: "garcilasco@gmail.com",
            userName: "fernan84",
            firstName: "Fernando",
            lastName: "García Lorca",
            birthdate: "20-09-2003",
            sex: "male",
            hasRuta: true,
            saldo: 30,
            telephone: "648902873",
            rating: [4.4, 8],
            comments: ["Fernando es una persona que siempre está dispuesta a ayudarte. Además, es muy buen conductor y muy puntual. ¡Lo recomiendo!",
            "Menudos viajes nos hemos montado con Fernando... Hehehehe!! Un tío muy divertido."],
            rutasOn: ["",""]
        },
        {
            email: "t3r3st3g3n@gmail.com",
            userName: "t3r3st3g3n",
            firstName: "Amelio",
            lastName: "Casado Gutiérrez",
            birthdate: "20-09-2003",
            sex: "male",
            hasRuta: true,
            saldo: 30,
            telephone: "610038621",
            rating: [3.8, 3],
            comments: ["Aunque el tiempo que hicimos los viajes juntos fué bien, cuando dejé de ir con él se enfadó muchísimo, incluso me amenazó. ¡Cuidado con este tipo!",
            "Todo correcto"],
            rutasOn: ["",""]
        },
        {
            email: "german_boy_1743@telefonica.net",
            userName: "rowshar",
            firstName: "Jesús",
            lastName: "Vázquez Triado",
            birthdate: "07-09-1990",
            sex: "male",
            hasRuta: true,
            saldo: 30,
            telephone: "610038621",
            rating: [4.6, 12],
            comments: ["Genial conductor y compañero de viaje. Me encanta ir con él!",
            "Muy amable y puntual, siempre intenta que esté a gusto en el trayecto :)",
            "Gracias por todo Jesús, fue un placer compartir tantos viajes contigo."],
            rutasOn: ["",""]
        },
        {
            email: "ramianboy@moume.com",
            userName: "ramian",
            firstName: "Amelio",
            lastName: "Casado Gutiérrez",
            birthdate: "20-09-2003",
            sex: "male",
            hasRuta: true,
            saldo: 30,
            telephone: "610038621",
            rating: [3.2, 10],
            comments: ["Muy simpático, aunque muchas veces llegaba tarde. De hecho, más de una vez tuve que coger un taxi ya que no llegaba al trabajo"],
            rutasOn: ["",""]
        },
        {
            email: "russsssknar@hotmail.com",
            userName: "russsssknar",
            firstName: "Amelio",
            lastName: "Casado Gutiérrez",
            birthdate: "20-09-2003",
            sex: "female",
            hasRuta: true,
            saldo: 30,
            telephone: "610038621",
            rating: [3.8, 3],
            comments: ["Correcto.",
            "Muy bien compartir viajes con Amanda, muy simpática y agradable.",
            "Amanda, me quedé con más ganas de ir contigo... No sé porque me bloqueaste con lo majo que soy :("],
            rutasOn: ["",""]
        },
        {
            email: "transylavnian_girl@gmail.com",
            userName: "tri4da",
            firstName: "Amelio",
            lastName: "Casado Gutiérrez",
            birthdate: "20-09-2003",
            sex: "female",
            hasRuta: true,
            saldo: 30,
            telephone: "610038621",
            rating: [4.0, 6],
            comments: ["Me gustó mucho el coche de Tríada... Y es encantadora!!!!!"],
            rutasOn: ["",""]
        }
    ]

    constructor() {
        super('user');
        this.version(1).stores({
            users: 'email'
        });
        this.addInitialUsers();
    }

    addInitialUsers() {
        this.users.get(this.usersToAdd[0].email)
            .then(ruta => {
                if (ruta == undefined) {
                    for (var i = 0; i < this.usersToAdd.length; i++) {
                        this.users.add(this.usersToAdd[i]);
                    }
                }
            })
    }

    addUser(user: User) {
        this.users.add(user);
    }

    getUser(email: string): Dexie.Promise<User> {
        return this.users.get(email);
    }

    getUsers(): Dexie.Promise<User[]> {
        return this.users.toArray();
    }

    setUser(email: string, user: User) {
        return this.users.update(email, user);
    }

    // deleteUser(userEmail: string) {
    //     this.users.delete(userEmail);
    // }


}

