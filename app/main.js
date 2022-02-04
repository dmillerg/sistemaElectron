const { app, BrowserWindow } = require("electron");
const electron = require('electron');
const path = require('path');
const url = require('url');
const ipc = electron.ipcMain;

let appWin;

createWindow = () => {
    appWin = new BrowserWindow({
        width: 1280,
        height: 720,
        frame: false,
        title: "Angular and Electron",
        icon: __dirname + '/ctc.png',
        // resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });
    appWin.loadURL(url.format({
        pathname: path.join(__dirname, './Sistema/index.html'),
        protocol: 'file',
        slashes: true
    }));

    appWin.setMenu(null);

    appWin.webContents.openDevTools();

    appWin.on("closed", () => {
        appWin = null;
    });

    ipc.on('window-close', function() {
        appWin.close();
    });

    ipc.on('window-mini', function() {
        appWin.minimize();
    });

    ipc.on('window-max', function() {
        if (appWin.isMaximized()) {
            appWin.restore();
        } else {
            appWin.maximize();
        }
    });
}

app.on("ready", createWindow);


var express = require("express")
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const multipart = require('connect-multiparty');
var server = express()
var db = require("./backend/database/database");
const bcrypt = require('bcrypt');

// Importamos las rutas
var routes = require('./backend/url');
server.use(cors());

// Configuring body parser middlewares
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// Configuracion para subir imagenes
server.use(fileUpload());

// Cargamos las rutas
server.use('/apis', routes);



// Server port
var HTTP_PORT = 3000
    // Start server
server.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});