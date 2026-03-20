const { AuthService } = require('./auth.service');
try {
    const service = new AuthService({}, {}, { get: () => 'test' });
    console.log('AuthService instance created successfully');
} catch (e) {
    console.error('Failed to create AuthService instance:', e);
}
