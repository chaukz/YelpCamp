const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const seedHelpers = require('./seedHelpers');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
}); 

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            title: `${seedHelpers.descriptors[Math.floor(Math.random() * seedHelpers.descriptors.length)]} ${seedHelpers.places[Math.floor(Math.random() * seedHelpers.places.length)]}`,
            price: Math.floor(Math.random() * 20) + 10,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            location: `${cities[random1000].city}, ${cities[random1000].state}`
        });
        await camp.save();
    }
};
seedDB().then(() => {
    mongoose.connection.close();
});  