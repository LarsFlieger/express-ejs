const express = require('express');
const app = express();

let firstLoggingSent = false

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('static'));

const DATA = [
    { id: 1, name: 'Michael', number: '+49 176 452584003' },
    { id: 2, name: 'Chris', number: '+49 176 415848528' },
    { id: 3, name: 'Pilot', number: '+49 176 24585400' },
];

app.use((req, res, next) => {
    if (!firstLoggingSent) {
        console.log('Console will log:\nreq.methode req.url req.body')
        firstLoggingSent = true
    }
    console.log(`${req.method} ${req.url} ${JSON.stringify(req.body)}`)
    next()
})

app.route('/')
    .get((req, res) => {
        res.render('index', { contacts: DATA });
    })
    .post((req, res) => {
        const { name, number } = req.body
        if (DATA.some((fruit) => fruit.name === name)) {
            res.status(400).render('error/duplicate', { name })
        } else {
            const id = DATA.length ? Math.max(...DATA.map((o) => o.id)) + 1 : 1
            const fruit = { id, name, number }
            DATA.push(fruit)
            res.redirect('/contacts/' + id)
        }
    })
app.get('/contacts/upload', (req, res) => {
    res.render('create');
})

app.route('/contacts/:id')
    .get((req, res) => {
        const id = parseInt(req.params.id);
        const contact = DATA.find((o) => o.id === id);

        res.render('show', contact);
    })
    .delete((req, res) => {
        const id = parseInt(req.params.id);
        const fruitIndex = DATA.findIndex((o) => o.id === id);

        if (fruitIndex === -1) res.status(400).send('Unknown id')
        else {
            DATA.splice(fruitIndex, 1)
            res.sendStatus(204)
        }
    })

app.use((req, res, next) => {
    res.render('error/404')
})

app.use((err, req, res, next) => {
    res.render('error/500')
    console.log(err)
})


app.listen(3000);
console.log('EJS server running on localhost:3000');