import { generateRandomId } from "../../../app/serverApp/data/IdGenerator"


describe('IdGenerator test suite', ()=>{
    it('should return a random string', ()=>{
        const randomId = generateRandomId();
        expect(randomId.length).toBe(20);
    })
})