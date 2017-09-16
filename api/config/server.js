module.exports = () => {
    const serverConfig = {
        port: 3000,
    };

    switch (process.env.NODE_ENV) {
    case 'production':
        break;
    case 'development':
        // Object.assign(serverConfig, { port: 3001 });
        break;
    default:
        break;
    }

    return serverConfig;
};
