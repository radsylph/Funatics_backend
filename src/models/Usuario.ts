import mongoose from "mongoose";
import bcrypt from "bcrypt";

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

const usuarioSchema = new mongoose.Schema<Usuario>(
  {
    name: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value: string) {
          return /^[a-zA-Z0-9.!#$   %&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zAZ0-9-]+)*$/.test(
            value
          );
        },
        message: "Agrega un correo válido",
      },
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      default: null,
    },
    confirmado: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

usuarioSchema.methods.verificarPassword = async function (password: string) {
  const result = await bcrypt.compare(password, this.password);
  console.log(result);
  return result;
};

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
