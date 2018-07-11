import { Request, Response } from "express";
import { Result } from "../models/result";
import { db, exel } from "../app";
import { Mailer } from "../utils/mailer";
import { User } from "../models/user";

/**
 * GET /
 * Akzeptieren des Benutzers
 */
export let getUser = (req: Request, res: Response) => {
  let v: Result = new Result();
  console.log("Parameter!=" + JSON.stringify(req.query));
  db.get("SELECT * FROM users where uuid='" + req.query.uuid + "';", (err: any, row: any) => {
    if (err) {
      return console.error(err.message);
    }
    if (row) {
      v.success = true;
      v.msg = "accepted for " + row.email;
      res.contentType('application/json');
      res.send(JSON.stringify(v));

      db.run("UPDATE users " +
        "SET accepted=datetime('now','localtime') WHERE uuid='" + req.query.uuid + "';");
      let user: User = new User();
      var dateFormat = require('dateformat');
      var now = new Date();
      dateFormat(now, "dd.mm.yyyy h:MM");
      user.accepted = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
      user.requested = row.generated;
      user.uuid = row.uuid;
      user.email = row.email;
      exel.addUser(user,2);

    }
    else {
      v.msg = "No ID " + req.query.uuid + " found";
      res.contentType('application/json');
      res.send(JSON.stringify(v));
    }
  });
};

export let setUser = (req: Request, res: Response) => {
  console.log("Post with Data!: " + JSON.stringify(req.body));
  const uuidv4 = require('uuid/v4');
  var uuid = uuidv4(); // ⇨ '10ba038e-48da-487b-96e8-8d3b99b6d18a'
  console.log("uuid=" + uuid);

  db.run("INSERT INTO users (email,uuid,generated)" +
    "VALUES ('" + req.body.email + "','" + uuid + "',datetime('now','localtime'));");
  let v: Result = new Result();
  v.success = true;
  v.msg = "EMail send to " + req.body.email;
  let m: Mailer = new Mailer();
  m.sendMail(req.body.email, uuid);
  res.contentType('application/json');
  res.send(JSON.stringify(v));
};

