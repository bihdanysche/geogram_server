export const AppConfig = {
    ACCESS_TOKEN_AGE: 30 * 24 * 3600 * 1000,
    REFRESH_TOKEN_AGE: 30 * 24 * 3600 * 1000,
    originURL: process.env.ORIGIN_URL || "http://localhost:5500",
    minio: {
        bucket: process.env.MINIO_BUCKET || "geogrambucket"
    },
    ratios: {
        avatar_ratio: 1 / 1,
        cover_ratio: 3 / 1
    }
};