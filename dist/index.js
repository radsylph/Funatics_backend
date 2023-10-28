"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env" });
const db_js_1 = __importDefault(require("./config/db.js"));
const userRoutes_js_1 = __importDefault(require("./routes/userRoutes.js")); // Importa las rutas de usuario
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.static("public"));
app.use("/auth", userRoutes_js_1.default);
app.set("view engine", "pug");
app.set("views", "./views");
app.use(express_1.default.static("public"));
try {
    db_js_1.default.on("error", (err) => {
        console.error("Error de conexión a la base de datos:", err);
    });
    db_js_1.default.once("open", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("La conexión a la base de datos se ha establecido");
    }));
}
catch (error) {
    console.log(error);
}
app.listen(port, () => console.log(`Example app listening on url ${port}!`));
