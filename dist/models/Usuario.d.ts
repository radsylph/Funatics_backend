interface Usuario {
    name: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    token: string | null;
    confirmado: boolean;
    timestamps: boolean;
    verificarPassword: (password: string) => Promise<boolean>;
}
declare const Usuario: any;
export default Usuario;
