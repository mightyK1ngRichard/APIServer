/* Старая реализация
const http = require("http");
const host = 'localhost';
const port = 8000;

const handler = (req, res) => {
    /// req - http-запрос, res - http-ответ.
    res.writeHead(200);
    res.end('Курс ПСП такой крутой!');

};

const server = http.createServer(handler);

/// ``` node server.js ``` - запускает сервер
server.listen(port, host, () => {
    console.log(`Сервер запущен по адресу http://${host}:${port}`);
});
*/
const {postgresPort} = require('./config.js')

const {Pool} = require('pg')
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
    const commandForSQL = req.params.command;
    const pool = new Pool({
        user: postgresPort.user_pg,
        host: postgresPort.host_pg,
        database: postgresPort.db_name_pg,
        password: postgresPort.password_pg,
        port: postgresPort.port_pg,
    });
    pool.query(commandForSQL, (err, dbData) => {
        if (err) {
            res.send(err);
        } else {
            res.send(dbData);
        }
        pool.end();
    });
})

app.listen(port, host, () => {
    console.log(`Сервер запущен по адресу  http://${host}:${port}`);
});