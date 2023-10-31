interface Datos {
    email: string;
    nombre: string;
    token: string | null;
}
declare const emailRegistro: (datos: Datos) => Promise<void>;
declare const emailReset: (datos: Datos) => Promise<void>;
export { emailRegistro, emailReset };
