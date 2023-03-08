const express = require('express');
const fs = require("fs");
const path = require("path");
const app = express();
const host = 'localhost';
const port = 8000;
const storageName = 'data/stocks.json';

const readJson = (fileName) => {
    const file = fs.readFileSync(path.join(__dirname, fileName), "utf8");
    return JSON.parse(file);
};

app.get('/stocks', (req, res) => {
    const stocks = readJson(storageName);
    res.send(stocks);
});

app.get('/stocks/:id', (req, res) => {
    const id = req.params.id;
    const numberId = Number.parseInt(id);

    if (Number.isNaN(numberId)) {
        res.status(400).send({status: 'Bad Request', message: 'id must be number!'});
    }

    const stocks = readJson(storageName);
    const stock = stocks.find((value) => {
        return value.id === numberId;
    });

    if (stock) {
        res.send(stock);
    } else {
        res.status(404).send({status: 'Not Found', message: `not found stock with id ${numberId}`});
    }
});

app.get('/database/:command', (req, res) => {
    const commendForSQL = req.params.command;
    console.log('Тут бы я сделал запрос к sql: ', commendForSQL);
    res.send(`Тут бы был результат SQL запроса: ${commendForSQL}`);
})

app.listen(port, host, () => {
    console.log(`Сервер запущен по адресу  http://${host}:${port}`);
});