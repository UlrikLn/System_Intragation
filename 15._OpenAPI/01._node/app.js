import express from 'express';
import usersRouter from './routers/usersRouter.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


const app = express();
const swaggerDefinition = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Users API',
            version: '0.0.1',
        }
    },
    // Ved at skrive *Router og ikke bare * tvinger man sig til at bruge router som filnavn. * er en wildcard, der matcher alt.
    apis: ['./routers/*Router.js']
};

const swaggerOptions = {
    swaggerDefinition,
    apis: ['./routers/*Router.js']
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerOptions)));

app.use(usersRouter);

app.use(express.json());


const PORT = process.env.PORT ?? 8080
app.listen(PORT, () => console.log("Server is running on port", PORT));