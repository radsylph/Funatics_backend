export interface UsuarioInterface {
  name: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  bio: string;
  profilePicture: string | null;
  followers: number;
  following: number;
  token: string | null;
  confirmado: boolean;
  timestamps: boolean;
  verificarPassword: (password: string) => Promise<boolean>;
}
