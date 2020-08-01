import * as request from 'request-promise';
const btoa = require('btoa');

export class Authorization {
    private static auth = null;
    private static authTime: Date = null;

    public static async AUTHORIZE (): Promise<string> {
        if (this.auth == null || this.isTokenExpired()) {
            await this.GET_NEW_TOKEN();
        }

        return `${this.auth.token_type} ${this.auth.access_token}`;
    }

    private static isTokenExpired(): boolean {
        let timeElapsed = Date.now() - this.authTime.getTime();

        // Get in hours.
        timeElapsed = timeElapsed / 3.6e+6;

        return timeElapsed > 3;
    }

    private static async GET_NEW_TOKEN() {
        const { ISSUER, CLIENT_ID, CLIENT_SECRET, SCOPE } = process.env;
        const token = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
        this.auth = await request({
            uri: `${ISSUER}/v1/token`,
            json: true,
            method: 'POST',
            headers: {
                authorization: `Basic ${token}`
            },
            form: {
                grant_type: 'client_credentials',
                scope: SCOPE
            }
        });

        this.authTime = new Date();
    }
}