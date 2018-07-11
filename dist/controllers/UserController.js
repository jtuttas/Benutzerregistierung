"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var result_1 = require("../models/result");
var app_1 = require("../app");
var mailer_1 = require("../utils/mailer");
var user_1 = require("../models/user");
/**
 * GET /
 * Akzeptieren des Benutzers
 */
exports.getUser = function (req, res) {
    var v = new result_1.Result();
    console.log("Parameter!=" + JSON.stringify(req.query));
    app_1.db.get("SELECT * FROM users where uuid='" + req.query.uuid + "';", function (err, row) {
        if (err) {
            return console.error(err.message);
        }
        if (row) {
            v.success = true;
            v.msg = "accepted for " + row.email;
            res.contentType('application/json');
            res.send(JSON.stringify(v));
            app_1.db.run("UPDATE users " +
                "SET accepted=datetime('now','localtime') WHERE uuid='" + req.query.uuid + "';");
            var user = new user_1.User();
            var dateFormat = require('dateformat');
            var now = new Date();
            dateFormat(now, "dd.mm.yyyy h:MM");
            user.accepted = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
            user.requested = row.generated;
            user.uuid = row.uuid;
            user.email = row.email;
            app_1.exel.addUser(user, 2);
        }
        else {
            v.msg = "No ID " + req.query.uuid + " found";
            res.contentType('application/json');
            res.send(JSON.stringify(v));
        }
    });
};
exports.setUser = function (req, res) {
    console.log("Post with Data!: " + JSON.stringify(req.body));
    var uuidv4 = require('uuid/v4');
    var uuid = uuidv4(); // ⇨ '10ba038e-48da-487b-96e8-8d3b99b6d18a'
    console.log("uuid=" + uuid);
    app_1.db.run("INSERT INTO users (email,uuid,generated)" +
        "VALUES ('" + req.body.email + "','" + uuid + "',datetime('now','localtime'));");
    var v = new result_1.Result();
    v.success = true;
    v.msg = "EMail send to " + req.body.email;
    var m = new mailer_1.Mailer();
    m.sendMail(req.body.email, uuid);
    res.contentType('application/json');
    res.send(JSON.stringify(v));
};
//# sourceMappingURL=UserController.js.map