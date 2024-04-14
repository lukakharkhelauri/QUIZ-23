const express = require('express');
const router = express.Router();
const Car = require('../models/Car');


router.get('/', async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/:id', getCar, (req, res) => {
    res.json(res.car);
});


router.post('/', async (req, res) => {
    const car = new Car({
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        color: req.body.color,
        price: req.body.price,
        mileage: req.body.mileage
    });

    try {
        const newCar = await car.save();
        res.status(201).json(newCar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', getCar, async (req, res) => {
    if (req.body.make != null) {
        res.car.make = req.body.make;
    }
    if (req.body.model != null) {
        res.car.model = req.body.model;
    }
    if (req.body.year != null) {
        res.car.year = req.body.year;
    }
    if (req.body.color != null) {
        res.car.color = req.body.color;
    }
    if (req.body.price != null) {
        res.car.price = req.body.price;
    }
    if (req.body.mileage != null) {
        res.car.mileage = req.body.mileage;
    }

    try {
        const updatedCar = await res.car.save();
        res.json(updatedCar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/api/cars/:id', (req, res) => {
    const carId = req.params.id;

    Car.findByIdAndRemove(carId)
        .then(removedCar => {
            if (!removedCar) {
                console.log('car not found', carId);
                return res.status(404).json({ message: 'car not found' });
            }
            console.log('car removed:', removedCar);
            res.status(200).json({ message: 'car removed', removedCar });
        })
        .catch(error => {
            console.error('error removing car:', error);
            res.status(500).json({ message: 'failed', error });
        });
});

async function getCar(req, res, next) {
    let car;
    try {
        car = await Car.findById(req.params.id);
        if (car == null) {
            return res.status(404).json({ message: 'car not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.car = car;
    next();
}

module.exports = router;

