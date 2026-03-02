export interface AppConfig {
    port: number;
    database: {
        url: string;
    };
    redis: {
        url: string;
    };
    jwt: {
        privateKey: string;
        publicKey: string;
        accessExpiresIn: string;
        refreshExpiresIn: string;
    };
    anthropic: {
        apiKey: string;
    };
    openai: {
        apiKey: string;
    };
    aws: {
        s3Bucket: string;
        region: string;
    };
    fcm: {
        serverKey: string;
    };
}

export default (): AppConfig => ({
    port: parseInt(process.env['PORT'] ?? '3000', 10),
    database: {
        url: process.env['DATABASE_URL'] ?? '',
    },
    redis: {
        url: process.env['REDIS_URL'] ?? '',
    },
    jwt: {
        privateKey: (process.env['JWT_SECRET_PRIVATE_KEY'] ?? '').replace(
            /\\n/g,
            '\n',
        ),
        publicKey: (process.env['JWT_SECRET_PUBLIC_KEY'] ?? '').replace(
            /\\n/g,
            '\n',
        ),
        accessExpiresIn: '15m',
        refreshExpiresIn: '7d',
    },
    anthropic: {
        apiKey: process.env['ANTHROPIC_API_KEY'] ?? '',
    },
    openai: {
        apiKey: process.env['OPENAI_API_KEY'] ?? '',
    },
    aws: {
        s3Bucket: process.env['AWS_S3_BUCKET'] ?? '',
        region: process.env['AWS_REGION'] ?? 'ap-south-1',
    },
    fcm: {
        serverKey: process.env['FCM_SERVER_KEY'] ?? '',
    },
});
