require('dotenv').config('../');

export default {
    APP: {
        PORT: Number(process.env.PORT) || 3000,
        HOST: process.env.HOST || 'https://a480-201-160-205-161.ngrok.io'
    }
}
