const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema } = require('../schemas');
const joi = require('joi'); 
const { isLoggedIn, isAuthor} = require('../middleware');



const validateCampground = (req, res, next) => {
  const schema = joi.object({
    campground: joi.object({
      title: joi.string().required(),
      price: joi.number().required().min(0),
      image: joi.string().required(),
      location: joi.string().required(),
      description: joi.string().required()
    }).required()
  });
  const { error } = schema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};



router.get('/', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
}));

router.get('/new',isLoggedIn, (req, res) =>{ 
  
  res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;  
  await campground.save();
  req.flash('success', 'Successfully created a new campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}));


router.get('/:id', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: 'reviews', populate: { path: 'author' } })
    .populate('author');
  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit',isLoggedIn,catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
})) ;

router.put('/:id',isLoggedIn,isAuthor,validateCampground,catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect(`/campgrounds/${id}`);
  }  
  const updatedCampground = await Campground.findById(id);
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${id}`);
}));

router.delete('/:id',isLoggedIn, catchAsync(async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash('success', 'Successfully deleted campground!');
  res.redirect('/campgrounds');
}));



module.exports = router;