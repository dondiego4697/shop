import got from 'got';
import {runInTransaction, initialiseTestTransactions} from 'typeorm-test-transactions';

import {TestContext} from 'tests/test-context';
import {TestFactory} from 'tests/test-factory';

const PATH = '/api/v1/catalog/dictionary';

initialiseTestTransactions();

describe(PATH, () => {
    const context = new TestContext();
    let url: string;

    beforeAll(async () => {
        url = await context.getServerAddress();
        await context.beforeAll();
    });

    afterAll(async () => {
        await context.afterAll();
    });

    it('should return correct result', async () => {
        await runInTransaction(async () => {
            const brand = await TestFactory.createBrand();
            const pet = await TestFactory.createPetCategory();
            const good = await TestFactory.createGoodCategory();

            const {statusCode, body} = await got.get(`${url}${PATH}`, {
                responseType: 'json'
            });

            expect(statusCode).toEqual(200);
            expect(body).toEqual({
                brands: [
                    {
                        code: brand.code,
                        displayName: brand.displayName
                    }
                ],
                goodCategories: [
                    {
                        code: good.code,
                        displayName: good.displayName
                    }
                ],
                petCategories: [
                    {
                        code: pet.code,
                        displayName: pet.displayName
                    }
                ]
            });
        });
    });
});