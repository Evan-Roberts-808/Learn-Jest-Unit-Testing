import { HTTP_CODES } from "../../../app/serverApp/model/ServerModel";

export class ResponseTestWrapper {
    public statusCode: HTTP_CODES;
    public headers = new Array<object>();
    public body: object;

    public writeHead(statusCode: HTTP_CODES, header: object) {
        this.statusCode = statusCode
        this.headers.push(header)
    }

    public write(stringifiedBody: string) {
        this.body = JSON.parse(stringifiedBody)
    }

    public end() {}

    public clearFields() {
        this.statusCode = undefined
        this.headers.length = 0
        this.body = undefined
    }
}