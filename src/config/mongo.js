const mongoose = require("mongoose");

const dbConnectMongoDB = () => {
    const { DB_URI, DB_URI_TEST, NODE_ENV } = process.env;
    const _DB_URI = NODE_ENV === "test" ? DB_URI_TEST : DB_URI;

    mongoose.connect(
        _DB_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        (err, res) => {
            if (!err) {
                console.log("CONEXION CORRECTA!!");
            } else {
                console.log("CONEXION IN-CORRECTA!!");
            }
        }
    );
};

module.exports = { dbConnectMongoDB };
