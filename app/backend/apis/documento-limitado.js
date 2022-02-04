const conexion = require('../database/database');
const bcrypt = require('bcrypt');
const { json } = require('body-parser');

function getDocuments(req, res) {
    conexion.all(`SELECT * FROM documento_limitado`, [], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        if (results.length > 0) {
            return res.status(200).json(results);
        } else {
            return res.status(200).send({ documents: 'no existe ningun documento limitado' });
        }
    });
}

function saveDocument(req, res) {
    var id = -1;
    var body = req.body;
    var no = body.no;
    var procedencia = body.procedencia;
    var asunto = body.titulo;
    var fecha = body.fecha;
    var movimiento1 = body.movimiento1;
    var movimiento2 = body.movimiento2;
    var destruccion = body.destruccion;
    var no_expediente = body.expediente;
    var observacion = body.observacion;
    var foto = { name: null };
    var foto_name = '';
    if (req.files) foto = req.files.foto;
    if (foto.name == null) {
        foto_name = 'ctc.png';
    } else {
        foto_name = no + '.jpg';
    }
    console.log('req.body *****', req.body);
    const parames = [no, procedencia.toString(), asunto.toString(), fecha.toString(), movimiento1.toString(), movimiento2.toString(), destruccion.toString(), no_expediente, observacion.toString(), foto_name.toString()];
    conexion.all(`INSERT INTO documento_limitado(id, no, procedencia, titulo, fecha, movimiento1, movimiento2, destruccion, expediente, observacion, imagen) VALUES (NULL,?,?,?,?,?,?,?,?,?,?)`, parames, (error) => {
        if (error)
            return res.status(500).send({ message: error });

        saveFoto(foto, foto_name);
        return res.status(201).send({ message: 'documento limitado  guardado correctamente' });

    });
}


function saveFoto(foto, title) {
    if (foto.name != null) {
        foto.mv(`./public/documento_limitado/${title}`, function(err) {
            if (err) {
                console.log('Error con la foto', err);
            }
        });
    }
}

function getFoto(req, res) {
    try {
        var id = req.params.id;
        conexion.all(`SELECT * FROM documento_limitado WHERE id = ${id}`, [], (error, results) => {
            if (error)
                throw error;
            if (results) {
                var path = require('path');
                res.status(200).sendFile(path.resolve('public/documento_limitado/' + results[0].imagen));
            }
        });
    } catch (error) {
        console.log(error);
    }
}

function deleteDocument(req, res) {
    const id = req.params.id;
    conexion.all(`SELECT * FROM documento_limitado WHERE id=${id}`, [], (err, result) => {
        if (err)
            return res.status(500).send({ message: err });
        if (result) {
            deleteFoto(result[0].imagen);
            conexion.all(`DELETE FROM documento_limitado WHERE id = ${id}`, [], (error, results) => {
                if (error)
                    return error;
                if (results) {
                    return res.status(200).send({ results });
                }
            });
        }
    });

}

function deleteFoto(imagen) {
    const pathViejo = `./public/documento_limitado/${imagen}`;
    // console.log(pathViejo);
    const fs = require("fs");
    if (fs.existsSync(pathViejo)) {
        console.log("borrado");
        fs.unlinkSync(pathViejo);
    }
    return "borrado correctamente";
}

function updateDocument(req, res) {
    // Recogemos un parámetro por la url
    var id = req.params.id;

    // Recogemos los datos que nos llegen en el body de la petición
    var body = req.body;
    var no = body.no;
    var procedencia = body.procedencia;
    var asunto = body.titulo;
    var fecha = body.fecha;
    var movimiento1 = body.movimiento1;
    var movimiento2 = body.movimiento2;
    var destruccion = body.destruccion;
    var no_expediente = body.expediente;
    var observacion = body.observacion;
    console.log(req.body, 'body')
    var foto = { name: null };
    if (req.files) foto = req.files.foto;
    console.log(foto.name, 'foto');
    // Buscamos por id y actualizamos el objeto y devolvemos el objeto actualizado
    var query = `UPDATE documento_limitado SET no=${no},procedencia="${procedencia}",titulo="${asunto}", fecha="${fecha}", movimiento1="${movimiento1}", movimiento2="${movimiento2}", destruccion="${destruccion}",expediente="${no_expediente}", observacion="${observacion}"`;
    console.log(query, 'query')
    if (foto.name != null) query += `,imagen="${no}.jpg" `;
    query += `WHERE id = ${id}`

    conexion.all(query, [], (error, results) => {
        if (error) {
            console.log(error, 'error');
            return res.status(500).send({ message: 'error en el servidor' });
        }
        if (results) {
            if (foto.name != null) {
                deleteFoto(no + '.jpg');
                saveFoto(foto, no + '.jpg');
            }
            return res.status(201).send({ message: 'actualizado correctamente' });
        } else {
            return res.status(404).send({ message: 'no existe ningun documento con ese id' });
        }
    });

}

module.exports = {
    getDocuments,
    saveDocument,
    getFoto,
    deleteDocument,
    updateDocument,
};