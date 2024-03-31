import app from "../../app";
import supertest from "supertest";

describe("POST/ addItem", () => {

    test("should not be able to add item of zero(0) quantity", () => {

        const item = 'bar';

        return supertest(app)
            .post(`/${item}/add`)
            .set('Content-Type', 'application/json')
            .send({
                "quantity": 0,
                "expiry": 10000
            })
            .expect(422)
            .then(response => {
                const jsBody = JSON.stringify(response.body);
                expect(jsBody).toContain("error");
                expect(jsBody).toContain("quantity must be greater than or equal to 1");
                expect(jsBody).not.toContain('expiry must be greater than or equal to 1');
                expect(jsBody).toContain("status");
                expect(response.body.status).toEqual("failed");
            })

    }, 100 * 1000)

    test("should not be able to add item of zero(0) expiry", () => {

        const item = 'bar';

        return supertest(app)
            .post(`/${item}/add`)
            .set('Content-Type', 'application/json')
            .send({
                "quantity": 10,
                "expiry": 0
            })
            .expect(422)
            .then(response => {
                const jsBody = JSON.stringify(response.body);
                expect(jsBody).toContain("error");
                expect(jsBody).toContain('expiry must be greater than or equal to 1');
                expect(jsBody).not.toContain("quantity must be greater than or equal to 1");
                expect(jsBody).toContain("status");
                expect(response.body.status).toEqual("failed");
            })

    }, 100 * 1000)

    test("should not be able to add item of zero(0) quantity and expiry", () => {

        const item = 'bar';

        return supertest(app)
            .post(`/${item}/add`)
            .set('Content-Type', 'application/json')
            .send({
                "quantity": 0,
                "expiry": 0
            })
            .expect(422)
            .then(response => {
                const jsBody = JSON.stringify(response.body);
                expect(jsBody).toContain("error");
                expect(jsBody).toContain("quantity must be greater than or equal to 1");
                expect(jsBody).toContain('expiry must be greater than or equal to 1');
                expect(jsBody).toContain("status");
                expect(response.body.status).toEqual("failed");
            })

    }, 100 * 1000)

    test("should not be able add item of negative quantity and expiry", () => {

        const item = 'bar';

        return supertest(app)
            .post(`/${item}/add`)
            .set('Content-Type', 'application/json')
            .send({
                "quantity": -10,
                "expiry": -10
            })
            .expect(422)
            .then(response => {
                const jsBody = JSON.stringify(response.body);
                expect(jsBody).toContain("error");
                expect(jsBody).toContain("\"original\":{\"quantity\":-10,\"expiry\":-10}");
                expect(jsBody).toContain("status");
                expect(response.body.status).toEqual("failed");
            })

    }, 100 * 1000)

    test("should add item successfully", () => {

        const item = 'bar';

        return supertest(app)
            .post(`/${item}/add`)
            .set('Content-Type', 'application/json')
            .send({
                "quantity": 20,
                "expiry": 10000
            })
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({});
            })

    }, 100 * 1000)
   
});

describe("POST/ sellItem", () => {

    test("should not be able to sell zero(0) quantity for an item.", async () => {

        const item = 'foo';
        const sellQ = 0;

        return supertest(app)
            .post(`/${item}/sell`)
            .set('Content-Type', 'application/json')
            .send({
                "quantity": sellQ
            })
            .expect(422)
            .then(response => {

                const jsBody = JSON.stringify(response.body);
                expect(jsBody).toContain("error");
                expect(jsBody).toContain("quantity must be greater than or equal to 1");
                expect(jsBody).toContain("status");
                expect(response.body.status).toEqual("failed");

            })
            
    }, 100 * 1000)

    test("should not be able to sell item that does not exist.", async () => {

        const item = 'bar-not-found';

        return supertest(app)
            .post(`/${item}/sell`)
            .set('Content-Type', 'application/json')
            .send({
                "quantity": 2
            })
            .expect(400)
            .then(response => {

                const jsBody = JSON.stringify(response.body);
                expect(jsBody).toContain("message");
                expect(response.body.message).toEqual(`Can't sell more than the non-expired quantity of the ${item} item. avaliable quantity 0`);
                expect(jsBody).toContain("status");
                expect(response.body.status).toEqual("failed");

            })
            
    }, 100 * 1000)

    test("should not be able to sell item more than the available item lots.", async () => {

        const item = 'foo';
        const addQ = 20;
        const sellQ = 21;

        await supertest(app)
            .post(`/${item}/add`)
            .set('Content-Type', 'application/json')
            .send({
                "quantity": addQ,
                "expiry": 10000
            })
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({});
            })

        return supertest(app)
            .post(`/${item}/sell`)
            .set('Content-Type', 'application/json')
            .send({
                "quantity": sellQ
            })
            .expect(400)
            .then(response => {

                const jsBody = JSON.stringify(response.body);
                expect(jsBody).toContain("message");
                expect(response.body.message).toEqual(`Can't sell more than the non-expired quantity of the ${item} item. avaliable quantity ${addQ}`);
                expect(jsBody).toContain("status");
                expect(response.body.status).toEqual("failed");

            })
            
    }, 100 * 1000)

    test("should sell item successfully", async () => {

        const item = 'bar';

        await supertest(app)
            .post(`/${item}/add`)
            .set('Content-Type', 'application/json')
            .send({
                "quantity": 20,
                "expiry": 10000
            })
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({});
            })

        return supertest(app)
            .post(`/${item}/sell`)
            .set('Content-Type', 'application/json')
            .send({
                "quantity": 2
            })
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({});
            })
            
    }, 100 * 1000)
   
});

describe("GET/ getItemQuantity", () => {

    test("should return quantity: 0, validTill: null for item with all expired lots or item that does not exist.", async () => {

        const item = "bar-not-found";

        return supertest(app)
            .get(`/${item}/quantity`)
            .set('Content-Type', 'application/json')
            .expect(200)
            .then(response => {

                const jsBody = JSON.stringify(response.body);
                expect(jsBody).toContain("quantity");
                expect(jsBody).toContain("validTill");
                expect(response.body.quantity).toEqual(0);
                expect(response.body.validTill).toEqual(null);

            })
            
    }, 100 * 1000)

    test("should return correct quantity and validTill of the closest item lot to expiry", async () => {

        const item = 'bar-2-2';
        const addQ = 20;
        const sellQ = 12;
        const q = addQ + addQ - sellQ;
        const expiry = 10000;
        const expiry2 = 20000;

        await supertest(app)
            .post(`/${item}/add`)
            .set('Content-Type', 'application/json')
            .send({
                "quantity": addQ,
                "expiry": expiry
            })
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({});
            })

        await supertest(app)
            .post(`/${item}/add`)
            .set('Content-Type', 'application/json')
            .send({
                "quantity": addQ,
                "expiry": expiry
            })
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({});
            })
        
        await supertest(app)
            .post(`/${item}/sell`)
            .set('Content-Type', 'application/json')
            .send({
                "quantity": sellQ
            })
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({});
            })

        return supertest(app)
            .get(`/${item}/quantity`)
            .set('Content-Type', 'application/json')
            .expect(200)
            .then(response => {

                const jsBody = JSON.stringify(response.body);
                expect(jsBody).toContain("quantity");
                expect(jsBody).toContain("validTill");
                expect(response.body.quantity).toEqual(q);
                expect(response.body.validTill).toBeLessThan(Date.now() + expiry2);

            })
            
    }, 100 * 1000)

    test("should getItemQuanity successfully", async () => {

        const item = 'bar-2';
        const addQ = 20;
        const sellQ = 12;
        const q = addQ - sellQ;
        const expiry = 10000;

        await supertest(app)
            .post(`/${item}/add`)
            .set('Content-Type', 'application/json')
            .send({
                "quantity": addQ,
                "expiry": expiry
            })
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({});
            })
        
        await supertest(app)
            .post(`/${item}/sell`)
            .set('Content-Type', 'application/json')
            .send({
                "quantity": sellQ
            })
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({});
            })

        return supertest(app)
            .get(`/${item}/quantity`)
            .set('Content-Type', 'application/json')
            .expect(200)
            .then(response => {

                const jsBody = JSON.stringify(response.body);
                expect(jsBody).toContain("quantity");
                expect(jsBody).toContain("validTill");
                expect(response.body.quantity).toEqual(q);

            })
            
    }, 100 * 1000)

});
