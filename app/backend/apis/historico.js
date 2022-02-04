const conexion = require('../database/database');

function saveAccion(user_id, accion) {
    let date = new Date();
    let fecha = date.getFullYear().toString() + '/' + (date.getMonth() + 1) + '/' + (date.getDate()) + ' ' + (date.getHours()) + ':' + (date.getMinutes()) + ':' + (date.getSeconds());
    conexion.all(`SELECT user FROM usuarios WHERE id=${user_id}`, [], (error, resulta) => {
        if (error) {
            console.log(error);
            return error;
        } else {
            let query = `INSERT INTO user_history (id, user_id, usuario, accion, fecha) VALUES (NULL, ${user_id}, "${resulta[0].user}", "${accion}", "${fecha}")`;
            conexion.all(query, [], (err, result) => {
                if (err) {
                    console.log('error', err);
                    return error;
                } else {
                    return result;
                }
            });
        }
    });
}

function saveActionAPI(req, res) {
    const body = req.body;
    const user_id = body.id;
    const accion = body.accion;
    return res.status(200).send({ status: saveAccion(user_id, accion) });
}

module.exports = {
    saveAccion,
    saveActionAPI,

};