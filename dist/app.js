"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var GraphSignin_1 = require("./controllers/GraphSignin");
var microsoft_graph_client_1 = require("@microsoft/microsoft-graph-client");
/**
 * Controllers (route handlers).
 */
var userController = require("./controllers/UserController");
var webController = require("./controllers/webController");
var ExcelTool_1 = require("./controllers/ExcelTool");
/**
 * Create SQL Lite DB
 */
var sqlite3 = require('sqlite3').verbose();
exports.db = new sqlite3.Database('./users.db');
exports.db.serialize(function () {
    exports.db.run("CREATE TABLE IF NOT EXISTS users (" +
        "id        INTEGER      PRIMARY KEY AUTOINCREMENT," +
        "uuid      VARCHAR (80) NOT NULL," +
        "email     VARCHAR (80) NOT NULL," +
        "generated DATETIME," +
        "accepted  DATETIME" +
        ");");
});
/**
 * Azure
 */
exports.secrets = require("../config/secrets");
// production apps should import from "@microsoft/microsoft-graph-client"; to grab the NPM module with the types declarations
// These are the types for graph nodes that are published separetlely (User field types, messages, contacts, etc.)
// To reference Microsoft Graph types, see directions at https://github.com/microsoftgraph/msgraph-typescript-typings/
// The dependency has been added in package.json, so just run npm install
var login = new GraphSignin_1.GraphSignin(exports.secrets.refresh_token, exports.secrets.client_id, exports.secrets.client_secret);
exports.exel = new ExcelTool_1.ExcelTool(login, exports.secrets.item_id, exports.secrets.table_id);
login.updateToken(function (token) {
    console.log("got token!");
    var client = microsoft_graph_client_1.Client.init({
        authProvider: function (done) {
            done(null, token);
        }
    });
    // Get the name of the authenticated user
    client.api('/me')
        .get(function (err, user) {
        if (err) {
            console.error(err);
            return;
        }
        console.log("User Contect:" + JSON.stringify(user));
    });
}, function (err) {
    console.error(err);
});
/**
 * Create Express server.
 */
//CORS middleware  
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    next();
};
var app = express();
//var router = express.Router();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(allowCrossDomain);
/**
 * Express configuration.
 */
app.set("port", process.env.PORT || 3001);
/**
 * Start Express server.
 */
app.route('/api/v1/')
    .get(userController.getUser)
    .post(userController.setUser);
app.get("/web/*", webController.getFile);
app.listen(app.get("port"), function () {
    console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
    console.log("  Press CTRL-C to stop\n");
});
module.exports = app;
//# sourceMappingURL=app.js.map