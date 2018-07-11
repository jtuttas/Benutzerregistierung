"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var ExcelTool = /** @class */ (function () {
    function ExcelTool(s, itemid, tableid) {
        this.signin = s;
        this.tableId = tableid;
        this.itemId = itemid;
    }
    ExcelTool.prototype.addUser = function (u, counter) {
        var _this = this;
        if (counter > 0) {
            var obj = {
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
            }, function (error, response, body) {
                console.log("add User status code:" + response.statusCode);
                if (error || response.statusCode == 401) {
                    _this.signin.updateToken(function (token) {
                        counter--;
                        _this.addUser(u, counter);
                    }, function (error) {
                    });
                }
            });
        }
    };
    return ExcelTool;
}());
exports.ExcelTool = ExcelTool;
//# sourceMappingURL=ExcelTool.js.map