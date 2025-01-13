import { DataBase } from "../../../app/serverApp/data/DataBase";
import {
  HTTP_CODES,
  HTTP_METHODS,
} from "../../../app/serverApp/model/ServerModel";
import { Server } from "../../../app/serverApp/server/Server";
import { RequestTestWrapper } from "./RequestTestWrapper";
import { ResponseTestWrapper } from "./ResponseTestWrapper";

jest.mock("../../../app/serverApp/data/DataBase");

const requestWrapper = new RequestTestWrapper();
const responseWrapper = new ResponseTestWrapper();

const fakeServer = {
  listen: () => {},
  close: () => {},
};

jest.mock("http", () => ({
  createServer: (cb: Function) => {
    cb(requestWrapper, responseWrapper);
    return fakeServer;
  },
}));

describe("Register requests test suite", () => {
  afterEach(() => {
    requestWrapper.clearFields();
    responseWrapper.clearFields();
  });

  it("should register new users", async () => {
    requestWrapper.method = HTTP_METHODS.POST;
    requestWrapper.body = {
      userName: "someUserName",
      password: "somePassword",
    };
    requestWrapper.url = "localhost:8080/register";

    jest.spyOn(DataBase.prototype, 'insert').mockResolvedValueOnce('1234')

    await new Server().startServer();
    await new Promise(process.nextTick) // solves timing issues where jest runs expects despite await

    expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
    expect(responseWrapper.body).toEqual(
      expect.objectContaining({ userId: expect.any(String) })
    );
  });

  it("should reject requests with no userName and password", async () => {
    requestWrapper.method = HTTP_METHODS.POST;
    requestWrapper.body = {

    };
    requestWrapper.url = "localhost:8080/register";

    await new Server().startServer();
    await new Promise(process.nextTick) // solves timing issues where jest runs expects despite await

    expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(responseWrapper.body).toEqual('userName and password required');
  });

  it("should do nothing for not supported methods", async () => {
    requestWrapper.method = HTTP_METHODS.DELETE;
    requestWrapper.body = {

    };
    requestWrapper.url = "localhost:8080/register";

    await new Server().startServer();
    await new Promise(process.nextTick) // solves timing issues where jest runs expects despite await

    expect(responseWrapper.statusCode).toBeUndefined();
    expect(responseWrapper.body).toBeUndefined();
  });

});
