const path = require('path');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const compression = require('compression')
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/error.controllers');
const paymentRoutes = require('./routes/payment.routes')


const session = require('express-session')
const MongoStore = require('connect-mongo');

const dotenv = require('dotenv');

dotenv.config({ path: './config/.env' });

app = express();
app.use(cookieParser());


// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//1) GLOBAL
app.use(cors());
// Set security HTTP headers
app.use(helmet());

app.use(compression())

// Developmet logging
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this Ip, please try again in an hour',
});

app.use('/api', limiter);

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Expose-Headers', 'X-Total-Count, Content-Range');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString;
  next();
});

//SESSION
const sessionStore =  MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
})

app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    store: sessionStore,
    cookie: { maxAge: 1000 * 5 },
    resave: false 
}));
//2) ROUTES
app.use('/api/v1/billers', paymentRoutes);


app.all('*', (req, res, next) => {
  let message = `Can't find ${req.originalUrl} on this server!`;
  const statusCode = 404;
  next(new AppError(message, statusCode));
});

//3) ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
