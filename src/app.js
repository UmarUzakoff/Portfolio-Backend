require("dotenv").config();
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const fileUpload = require('express-fileupload');
const app = express();

const routes = require("./routes");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/uploads", express.static(process.cwd() + "/uploads"));
app.use(fileUpload());
app.set('view engine', 'ejs');
app.use(routes);

app.all("/*", async(req, res) => {
    return res.status(404).json({ message: "Route not found!"})
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`);
});