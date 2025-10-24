import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import routes from "./routes/index.js";

const app = express();
const port = process.env.SERVER_PORT || 4000;
const host = process.env.SERVER_HOST;

dotenv.config();

//middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser())
app.use(cors({ origin: "*" }));
app.use(morgan('tiny'));

//route
app.use(routes);


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port,() => {
    console.log(`Server is running on ${host}:${port}`);
})

export default app;