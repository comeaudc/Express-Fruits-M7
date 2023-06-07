const express = require('express');
const Fruit = require('./models/fruits');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware here
app.set('view engine', 'jsx');
app.engine('jsx', require('jsx-view-engine').createEngine());

app.use((req, res, next) => {
  console.log('I run for all routes');
  next();
});
app.use(express.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => {
  console.log('connected to mongo');
});

//Show all fruits
app.get('/fruits', async (req, res) => {
  let allFruits = await Fruit.find({});

  res.render('Index', {
    fruits: allFruits,
  });
});

app.post('/fruits/', async (req, res) => {
  if (req.body.readyToEat === 'on') {
    //if checked, req.body.readyToEat is set to 'on'
    req.body.readyToEat = true;
  } else {
    //if not checked, req.body.readyToEat is undefined
    req.body.readyToEat = false;
  }

  let fruit = new Fruit({
    name: req.body.name,
    color: req.body.color,
    readyToEat: req.body.readyToEat,
  });

  await fruit.save();
  res.redirect('/fruits');
  // Fruit.create(req.body, (error, createdFruit) => {
  //   res.send(createdFruit);
  // });
});

app.get('/fruits/new', (req, res) => {
  res.render('New');
});

//Show individual fruits
app.get('/fruits/:id', async (req, res) => {
  try {
    const foundFruit = await Fruit.findById(req.params.id);
    res.render('Show', { fruit: foundFruit });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Tell express listen
app.listen(port, () => {
  console.log(`Server is listening on, ${port}`);
});
