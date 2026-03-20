const { generateKeyPairSync } = require('crypto');
const { writeFileSync } = require('fs');

/**
 * Generates an RS256 key pair for JWT signing.
 * Output is formatted for .env file compatibility.
 */
function generateKeys() {
    console.log('Generating RS256 key pair...');

    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });

    // Format for .env (replace newlines with \n)
    const envPrivateKey = privateKey.replace(/\n/g, '\\n');
    const envPublicKey = publicKey.replace(/\n/g, '\\n');

    console.log('\n--- PUBLIC KEY (.env format) ---');
    console.log(envPublicKey);

    console.log('\n--- PRIVATE KEY (.env format) ---');
    console.log(envPrivateKey);

    console.log('\n--- SUMMARY ---');
    console.log('Copy the values above into your .env file as JWT_SECRET_PUBLIC_KEY and JWT_SECRET_PRIVATE_KEY.');
}

generateKeys();
