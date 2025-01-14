const swaggerJsDoc=require('swagger-jsdoc')

const  swaggerOption={
    swaggerDefinition:{
        openapi: '3.0.0',
        info: {
            title: 'E-commerce API',
            version:'1.0.0',
            description: 'API documentation for E-commerce website',

        },
        servers:[
            {
                url: 'http://localhost:3000',

            }

        ]
    },
    apis: ['./routes/paymentRoutes.js'],

}


const swaggerDocs=swaggerJsDoc(swaggerOption)

module.exports=swaggerDocs;