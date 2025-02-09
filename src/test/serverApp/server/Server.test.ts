import { Authorizer } from "../../../app/serverApp/auth/Authorizer"
import { ReservationsDataAccess } from "../../../app/serverApp/data/ReservationsDataAccess"
import { LoginHandler } from "../../../app/serverApp/handlers/LoginHandler"
import { RegisterHandler } from "../../../app/serverApp/handlers/RegisterHandler"
import { ReservationsHandler } from "../../../app/serverApp/handlers/ReservationsHandler"
import { HTTP_CODES } from "../../../app/serverApp/model/ServerModel"
import { Server } from "../../../app/serverApp/server/Server"

jest.mock('../../../app/serverApp/auth/Authorizer')
jest.mock('../../../app/serverApp/data/ReservationsDataAccess')
jest.mock('../../../app/serverApp/handlers/LoginHandler')
jest.mock('../../../app/serverApp/handlers/RegisterHandler')
jest.mock('../../../app/serverApp/handlers/ReservationsHandler')


const requestMock = {
    url: '',
    headers: {
        'user-agent': 'jest-test'
    }
}

const responseMock = {
    end: jest.fn(),
    writeHead: jest.fn()
}

const serverMock = {
    listen: jest.fn(),
    close: jest.fn()
}


jest.mock('http', ()=>({
    createServer : (cb: Function) =>{
        cb(requestMock, responseMock)
        return serverMock
    }
}))


describe('Server test suite', ()=>{

    let sut: Server

    beforeEach(()=>{
        sut = new Server();
        expect(Authorizer).toBeCalledTimes(1);
        expect(ReservationsDataAccess).toBeCalledTimes(1);
    });

    afterEach(()=>{
        jest.clearAllMocks();
    });

    it('should start server on port 8080 and end the request', async ()=>{
        await sut.startServer();

        expect(serverMock.listen).toBeCalledWith(8080);

        console.log('checking response.end calls:')
        expect(responseMock.end).toBeCalled();
    })

    it('should handle register requests', async ()=>{
        requestMock.url = 'localhost:8080/register';
        const handleRequestSpy = jest.spyOn(RegisterHandler.prototype, 'handleRequest');

        await sut.startServer();

        expect(handleRequestSpy).toBeCalledTimes(1);
        expect(RegisterHandler).toBeCalledWith(requestMock, responseMock, expect.any(Authorizer));
    });

    it('should handle login requests', async ()=>{
        requestMock.url = 'localhost:8080/login';
        const handleRequestSpy = jest.spyOn(LoginHandler.prototype, 'handleRequest');

        await sut.startServer();

        expect(handleRequestSpy).toBeCalledTimes(1);
        expect(LoginHandler).toBeCalledWith(requestMock, responseMock, expect.any(Authorizer));
    });

    it('should handle reservation requests', async ()=>{
        requestMock.url = 'localhost:8080/reservation';
        const handleRequestSpy = jest.spyOn(ReservationsHandler.prototype, 'handleRequest');

        await sut.startServer();

        expect(handleRequestSpy).toBeCalledTimes(1);
        expect(ReservationsHandler).toBeCalledWith(
            requestMock, 
            responseMock, 
            expect.any(Authorizer),
            expect.any(ReservationsDataAccess));
    });

    it('should do nothing for not supported routes', async ()=>{
        requestMock.url = 'localhost:8080/someRandomRoute';
        const validateTokenSpy = jest.spyOn(Authorizer.prototype, 'validateToken');

        await sut.startServer();

        expect(validateTokenSpy).not.toBeCalled();
    });


    it('should handle errors in serving requests', async ()=>{
        requestMock.url = 'localhost:8080/reservation';
        const handleRequestSpy = jest.spyOn(ReservationsHandler.prototype, 'handleRequest');
        handleRequestSpy.mockRejectedValueOnce(
            new Error('Some error')
        )

        await sut.startServer();

        expect(responseMock.writeHead).toBeCalledWith(
            HTTP_CODES.INTERNAL_SERVER_ERROR, 
            JSON.stringify(`Internal server error: Some error`)
        )
    });

    it('should stop the server if started',async ()=>{
        serverMock.close.mockImplementationOnce((cb: Function)=>{
            cb();
        })

        await sut.startServer();

        await sut.stopServer();

        expect(serverMock.close).toBeCalledTimes(1);
    })

    it('should forward error while stopping server',async ()=>{
        serverMock.close.mockImplementationOnce((cb: Function)=>{
            cb(new Error('Error while closing server!'));
        })

        await sut.startServer();

        expect(async ()=>{
            await sut.stopServer();
        }).rejects.toThrowError('Error while closing server!')

        expect(serverMock.close).toBeCalledTimes(1);
    })



})