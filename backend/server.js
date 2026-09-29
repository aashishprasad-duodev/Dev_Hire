require("dotenv").config();

const app = require("./app.js");
const connectDB = require("./db/connection.js");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`DevHire server is running on http://localhost:${PORT}`)
    })
};

startServer();