require('dotenv').config('../');

export default {
    APP: {
        PORT: Number(process.env.PORT) || 4005,
        HOST: process.env.HOST || 'https://799a-201-160-205-66.ngrok.io'
    },
    GOOGLE: {
        URL: ''
    }
}
