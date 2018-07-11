import { GraphSignin } from "./GraphSignin";
import { User } from "../models/user";
import * as request from 'request';

export class ExcelTool {

    private signin: GraphSignin;
    private tableId: string;
    private itemId: string;
    constructor(s: GraphSignin, itemid: string, tableid: string) {
        this.signin = s;
        this.tableId = tableid;
        this.itemId = itemid;
    }

    public addUser(u: User, counter: number) {
        if (counter > 0) {
            let obj: any = {
                "values": [[u.uuid, u.requested, u.accepted, u.email]],
                "index": 0
            };
            console.log("Send to Server:" + JSON.stringify(obj));
            console.log("URL:" + 'https://graph.microsoft.com/v1.0/me/drive/items/' + this.itemId + '/workbook/tables(\'' + this.tableId + '\')/Rows');

            request({
                uri: 'https://graph.microsoft.com/v1.0/me/drive/items/' + this.itemId + '/workbook/tables(\'' + this.tableId + '\')/Rows',
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.signin.getAccessToken()
                },
                form: JSON.stringify(obj),
            }, (error, response, body) => {
                console.log("add User status code:" + response.statusCode);
                if (error || response.statusCode==401) {
                    this.signin.updateToken(
                        token => {
                            counter--;
                            this.addUser(u, counter);
                        },
                        error => {

                        }
                    );
                }
            });
        }
    }
}