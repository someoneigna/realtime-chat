const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyparser = require('body-parser');

const path = require('path');
const multer = require('multer');

const crypto = require('crypto');
const mime = require('mime');

const { Client, Pool } = require('pg');
require('dotenv').config();

const pgConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}
const pgPool = new Pool(pgConfig);

process.on('exit', () => {
    pgPool.end();
});

const FilesTable = 'Files';

async function saveFile(dbData) {
    try {
        const insertQuery = 'INSERT INTO ' + FilesTable +  '(id, name, path) VALUES ($1::text, $2::text, $3::text)'
        const insertValues = Object.values(dbData);

        await pgPool.query(insertQuery, insertValues);       
    } catch (error) {
        console.log('Error saving file to db:' + error);        
    }     
}

async function getFile(fileId) {
    try {        
        const selectQuery = 'SELECT * FROM ' + FilesTable + ' WHERE id = $1::text';
        const selectParams = [fileId];

        const res = await pgPool.query(selectQuery, selectParams);        

        if (res.rowCount == 0) {
            console.log('No file with id:' + fileId);
            return null
        }
        console.log(JSON.stringify(res));
        return { path: res.rows[0].path, originalname: res.rows[0].name }

    } catch (error) {
        console.log('Error retrieving file from db:' + error);              
    }     
}

const storage = multer.diskStorage({    
    destination: (req, file, callback) => {
        console.log(`Uploading:${file.originalname}`);
        callback(null, './uploads');
    }
});

const upload = multer({ storage: storage }).single('file');

const port = 3001;

function filter(req, res, next) {
    if (req.url.includes('/uploads') && !req.url.endsWith('/')) {
       res.sendFile(path.join(__dirname, req.url));
       return;
    }
    next();
}

app.use(filter);

app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, 'client/build/')));

http.listen(port, function() {
    console.log(`Listening on ${port}`);
});

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.end('Failed to upload file');
        }        
        
        dbData = {
            id: req.file.filename,
            name: req.file.originalname,
            path: './uploads/' + req.file.filename                
        }

        console.log('Writing to db:' + JSON.stringify(dbData));
        saveFile(dbData)
        .then((result) => {
            console.log
            res.json({ message: 'Succesfully uploaded file' });
            io.emit('file_upload', { url: dbData.path, name: req.file.originalname });
        })
        .catch((err) => {
            err.json({message: 'Failed to upload file'}).status(500);
        })
    })
});

let users = [];

io.on('connection', function(socket) {    

    socket.on('connected', function(nickname) {
        socket.username = nickname;
        console.log(`User connected:${socket.username}`);
        users.push(nickname);        
        io.emit('users_status', users);
    });

    socket.on('disconnect', function() {
        users = users.filter(u => u !== socket.username);
        console.log(`User disconnected:${socket.username}`);
        io.emit('users_status', users);
    });

    socket.on('message', function(message) {
        io.emit('message', { username: socket.username, text: message });
        console.log(`${socket.username}: ${JSON.stringify(message)}`);
    })    
});