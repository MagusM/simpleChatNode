var request  = require('request');

describe('calc', () => {
    it('should multiply 2 and 2', () => {
        expect(2*2).toBe(4);
    })
});

describe('get messages', () => {
    it('should return 200 ok', (done) => { //to make ti async - so we can see output of console.log
        request.get('http://localhost:3000/messages', (err, res) => {
            expect(res.statusCode).toEqual(200);
            done();
        });
    })

    it('should return a list thats not empty', (done) => { //to make ti async - so we can see output of console.log
        request.get('http://localhost:3000/messages', (err, res) => {
            expect(JSON.parse(res.body.length)).toBeGreaterThan(0);
            done();
        });
    })
});

describe('get messages from a specific user', () => {
    it('should return 200 ok', (done) => { //to make ti async - so we can see output of console.log
        request.get('http://localhost:3000/messages/simon', (err, res) => {
            expect(res.statusCode).toEqual(200);
            done();
        })
    })
    it('the name should be simon', () => {
        request.get('http://localhost:3000/messages/simon', (err, res) => {
            expect(JSON.parse(res.body)[0].name).toEqual('simon');
            done();
        })
    })
});