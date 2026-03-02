import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),

    PORT: Joi.number().default(3000),

    // ── Required to boot ─────────────────────────────────────────────────
    // Must be valid Postgres/Redis URIs so the DB/cache modules connect
    DATABASE_URL: Joi.string().uri().required(),
    REDIS_URL: Joi.string().uri().required(),

    // JWT RS256 PEM keys stored as single-line strings (\n = newline)
    JWT_SECRET_PRIVATE_KEY: Joi.string().min(1).required(),
    JWT_SECRET_PUBLIC_KEY: Joi.string().min(1).required(),

    // ── Required in production, optional in development ───────────────────
    // Phase 2 features (AI chat, exports, push notifications)
    ANTHROPIC_API_KEY: Joi.when('NODE_ENV', {
        is: 'production',
        then: Joi.string().required(),
        otherwise: Joi.string().default('dev-placeholder'),
    }),

    OPENAI_API_KEY: Joi.when('NODE_ENV', {
        is: 'production',
        then: Joi.string().required(),
        otherwise: Joi.string().default('dev-placeholder'),
    }),

    AWS_S3_BUCKET: Joi.when('NODE_ENV', {
        is: 'production',
        then: Joi.string().required(),
        otherwise: Joi.string().default('dev-bucket'),
    }),

    AWS_REGION: Joi.string().default('ap-south-1'),

    FCM_SERVER_KEY: Joi.when('NODE_ENV', {
        is: 'production',
        then: Joi.string().required(),
        otherwise: Joi.string().default('dev-placeholder'),
    }),
});
