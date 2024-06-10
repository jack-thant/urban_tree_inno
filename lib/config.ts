interface Config {
    apiUrl: string;
}

const config: { [key: string]: Config } = {
    development: {
        apiUrl: 'http://127.0.0.1:8000',
    },
    production: {
        apiUrl: 'https://urban-tree-fast-api-mcrtr3m3vq-uc.a.run.app',
    },
};

const env = (process.env.NODE_ENV as keyof typeof config) || 'development';

export default config[env];