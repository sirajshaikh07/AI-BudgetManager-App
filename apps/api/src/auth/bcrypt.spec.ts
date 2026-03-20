import * as bcrypt from 'bcrypt';

describe('Bcrypt Test', () => {
    it('should pass', async () => {
        const hash = await bcrypt.hash('test', 10);
        expect(hash).toBeDefined();
    });
});
