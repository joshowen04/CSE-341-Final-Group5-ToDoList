mongoose.Promise = global.Promise;
require('dotenv').config({path:"./config/.env"});
MONGODB_URL = process.env.MONGODB_URL;
console.log(`Database URL is ${MONGODB_URL}`);

mongoose.connect(MONGODB_URL); 