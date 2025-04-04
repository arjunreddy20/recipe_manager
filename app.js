require("dotenv").config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const reviewRoutes = require('./routes/reviews');
const collectionRoutes = require('./routes/collections');
const userRoutes = require('./routes/users');
const authorRoutes = require('./routes/authorRoutes');
const searchRoutes = require("./routes/search")
const myCollectionRoutes = require('./routes/myCollectionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const path = require('path');

require('./models/associations');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'), { index: 'signup.html' }));

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/authors', authorRoutes); 
app.use('/api/search', searchRoutes);
app.use('/api/my-collections', myCollectionRoutes);
app.use('/api/dashboard', dashboardRoutes);



const PORT = process.env.PORT || 5001;

//sequelize.sync().then(() => {
//    app.listen(PORT, () => {
       // console.log(`Server is running on port ${PORT}`);
//    });
//});


async function testConnection(){
    try{
        await sequelize.sync()
        app.listen(PORT)
    }catch(error){
        console.log(error)
    }
}

testConnection();