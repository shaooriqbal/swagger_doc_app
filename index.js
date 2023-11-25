const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const localRoutes = require('./routes/localDbRoutes');
const cors = require('cors');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRoutes);
app.use(localRoutes);
app.use(cors());
const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Users API',
        version: '1.0.0',
        description: 'API documentation for Your user route',
      },
    },
    apis: ['./routes/*.js'],
  };
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


//mongoose connection
mongoose
    .connect("mongodb://192.168.1.17:27017/prompt-engine-db", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(3000, () => {
            console.log('Express server started...');
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
