const express = require("express");
const cors = require("cors");
require('dotenv').config()

const mainRouter = require("./routes/index")

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    console.log("Hello");
    return res.status(200).send("Hello from the server!");
})


app.use('/api/v1', mainRouter);

app.get('*', function (req, res) {
    res.status(404).json({ message: "Route Not Found!" });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})