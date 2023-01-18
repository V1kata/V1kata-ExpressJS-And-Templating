const express = require('express');
const handlebars = require('express-handlebars');

const validateMiddleware = require('./middleware');

const app = express();

app.engine('handlebars', handlebars.engine()); // start an engine
app.set('view engine', 'handlebars'); // view engine using handlebars
// app.set('views', './html'); // if the folder is not named views and is not in the main directory you can set on views the folder

app.use(express.static('public')); // Looking into static folders
app.use(validateMiddleware); // Using a middleware

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/old', (req, res) => {
    res.send(`
    <html>
        <head>
            <link rel="stylesheet" href="/css/style.css" />
        </head>
        <body>
            <h1>This is my first expressJs server</h1>
            <a href="/cats">Go to cats</a>
            <a href="/dogs">Go to dogs</a>
        </body>
    </html>`);
});

const middleware = (req, res, next) => {
    let catId = Number(req.params.catId)
    if (!catId) {
        res.send('Invalid cat id');
        return
    }

    req.catId = catId;

    next();
}

app.get('/cats', (req, res) => {
    const cats = [
        { name: 'Navcho', breed: 'Persian', age: 7 },
        { name: 'Sisa', breed: 'Angora', age: 12 },
        { name: 'Dom', breed: 'Banana', age: 3 },
        { name: 'Zuza', breed: 'None', age: 5 }
    ]
    res.render('cats', { cats });
});

app.get('/cats/:catId', middleware, (req, res) => {
    res.render('cat', { id: req.params.catId, isOdd: req.catId % 2 != 0 });
})

// app.use(validateMiddleware);
app.get('/dogs', (req, res) => {
    res.send('<h1>Dogs page here</h1><a href="/">Go to home</a><a href="/cats">Go to cats</a>');
});

app.get('/dogs/img', (req, res) => {
    res.sendFile('/public/images/dog.jpg', { root: __dirname }); //__dirname - same directory
    // res.download('./dog.jpg');
    // res.attachment('./dog.jpg');
});

app.get('/dogs/:dogId', (req, res) => {
    res.send(`Dog id - ${req.params.dogId}`);
});

app.get('/json', (req, res) => {
    res.json({ ok: true, message: 'Hello from json' });
});

app.post('/cats', (req, res) => {
    res.send('Cat is created');
});

app.put('/cats', (req, res) => {
    res.send('Cat is updated')
});

app.delete('/cats', (req, res) => {
    res.send('Cat is deleted')
});

app.get('/redirect', (req, res) => {
    res.redirect('/redirected');
});

app.get('/redirected', (req, res) => {
    res.send('This is redirected page');
});

app.get('/ab*cd', (req, res) => {
    res.send('You are on ab something cd');
});

app.route('/test')
    .get((req, res) => {
        res.send('Get for /test');
    })
    .post((req, res) => {
        res.send('Post for /test');
    })
    .all((req, res) => {
        res.send(`${req.method} for ${req.url}`);
    });

app.get('*', (req, res) => {
    res.send('Page Not Found 404');
});

app.listen(5000, () => console.log('Server is running on port 5000...'));