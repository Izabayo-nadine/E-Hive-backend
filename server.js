const express=require('express');
const dotenv=require('dotenv');
const dbConnection=require('./config/db');
const swaggerUi=require('swagger-ui-express')
const swaggerDocs=require('./swaggerOption')
const ProductRoutes=require('./routes/productRoutes');
const UserRoutes=require('./routes/userRoutes');
const OrderRoutes=require('./routes/orderRoutes');
const ReportRoutes=require('./routes/reportRoutes')
const PaymentRoutes=require('./routes/paymentRoutes');
dotenv.config();

dbConnection();
const app=express();

app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs))


app.use("/api/",ProductRoutes);
app.use('/user/',UserRoutes);
app.use('/order/',OrderRoutes);
app.use('/report',ReportRoutes);
app.use('/payments',PaymentRoutes);
app.use(express.json());

const port=3000;
app.listen(port,()=>{
    console.log(`server is running on port: ${port}`);
})