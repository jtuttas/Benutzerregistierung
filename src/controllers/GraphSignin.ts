import * as request from 'request';


export class GraphSignin {
    private token: string;
    private refresh_token: string;
    private client_id: string;
    private client_sercret: string;


    constructor(refresh: string, clientID: string, clientSecret: string) {
        this.refresh_token = refresh;
        this.client_id = clientID;
        this.client_sercret = clientSecret;
    }

    public updateToken( success:(t:string) => any,error:(err:any) => any): void {

        let data: string = 'client_id=' + this.client_id +
            '&scope=https%3A%2F%2Fgraph.microsoft.com%2Fmail.read' +
            '&refresh_token=' + this.refresh_token +
            '&redirect_uri=https://login.live.com/oauth20_desktop.srf' +
            '&grant_type=refresh_token' +
            '&client_secret=' + this.client_sercret;

        request({
            uri: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
            method: "POST",
            headers: {
                'Content-Type': 'x-www-form-urlencoded'
              },
            form: data,
          }, (error, response, body) => {
            console.log("update Token retuerned status code:"+response.statusCode);
            if (response.statusCode==200) {
                let obj = JSON.parse(body);
                this.token = obj.access_token;
                this.refresh_token = obj.refresh_token;
                console.log("update acces token to: "+this.token.substring(0,20)+"...");   
                success(this.token);             
            }
            else {
                error(error);
            }
            if (error) {
                error(error);
            }
          });

    }

    getAccessToken(): any {
        return this.token;
    }

}
