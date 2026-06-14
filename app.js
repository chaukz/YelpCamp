const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const joi = require('joi');
const { campgroundSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');


const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};


const validateCampground = (req, res, next) => {
  const campgroundSchema = joi.object({
    campground: joi.object({
      title: joi.string().required(),
      price: joi.number().required().min(0),
      image: joi.string().required(),
      location: joi.string().required(),
      description: joi.string().required()
    }).required()
  })
  const { error } = campgroundSchema.validate(req.body);
  
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  }else {
    next();
  } 
};


app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);


app.get('/', (req, res) => res.render('home'));




app.all('*path', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err,req,res,next) => {
  const { statusCode = 500 } = err;
  if (!err.message)  err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('error', { err });
});



app.listen(3000, () => console.log('Server running on http://localhost:3000/'));
