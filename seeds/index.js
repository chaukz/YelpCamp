const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const seedHelpers = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

const seedImg = [
    {
        url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
        filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
    },
    {
        url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
        filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
    }
];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '6a3d3656ebc5111b3091981e',
            title: `${seedHelpers.descriptors[Math.floor(Math.random() * seedHelpers.descriptors.length)]} ${seedHelpers.places[Math.floor(Math.random() * seedHelpers.places.length)]}`,
            price: Math.floor(Math.random() * 20) + 10,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            images: seedImg
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});