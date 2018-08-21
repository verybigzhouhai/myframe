const config = {};
const env = 'dev'; //product

if (env == 'dev') {
    //数据库连接
    config.db = {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'test'
    }

    config.url = 'localhost:3001';

    config.front_url = 'http://localhost:8080';

} else if (env == 'product') {
    //数据库连接
    config.db = {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'test'
    }

    config.url = 'localhost:3001';

    config.front_url = 'localhost:8080';
}


module.exports = config;