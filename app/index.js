// console.log('Hola');
const ipc = require('electron').ipcRenderer;
// // var ipc = require('electron');
// document.getElementById('close').addEventListener('click', () => {
//     console.log('asdasda');
//     ipc.send('window-close');
// });


document.getElementById('close').addEventListener('click', () => {
    console.log('cerrando app');
    ipc.send('window-close');
});

document.getElementById('min').addEventListener('click', () => {
    console.log('minimizando app');
    ipc.send('window-mini');
});

document.getElementById('max').addEventListener('click', () => {
    console.log('maximizando app');
    ipc.send('window-max');
});