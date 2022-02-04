const conexion = require('../database/database');
const bcrypt = require('bcrypt');
const { json } = require('body-parser');

function getDocuments(req, res) {
    conexion.all(`SELECT * FROM documento_ordinario_personal`, [], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        if (results.length > 0) {
            return res.status(200).json(results);
        } else {
            return res.status(200).send({ documents: 'no existe ningun documento ordinario personal' });
        }
    });
}

function saveDocument(req, res) {
    var id = -1;
    var body = req.body;
    var no = body.no;
    var fecha = body.fecha;
    var procedencia = body.procedencia;
    var asunto = body.asunto;
    var destino = body.destino;
    var archivo = body.archivo;
    var foto = { name: null };
    var foto_name = '';
    if (req.files) foto = req.files.foto;
    foto_name = no + '.jpg';
    const parames = [no, fecha.toString(), procedencia.toString(), asunto.toString(), destino.toString(), archivo.toString(), foto_name];
    conexion.all(`INSERT INTO documento_ordinario(id, no, fecha, procedencia, asunto, destino, archivo, imagen) VALUES (NULL,?,?,?,?,?,?,?)`, parames, (error) => {
        if (error)
            return res.status(500).send({ message: error });

        saveFoto(foto, foto_name);
        return res.status(201).send({ message: 'documento ordinario personal  guardado correctamente' });

    });
}


function saveFoto(foto, title) {
    if (foto.name != null) {
        foto.mv(`./public/documento_ordinario_personal/${title}`, function(err) {
            console.log('Error con la foto', err);
        });
    }
}

function getFoto(req, res) {
    try {
        var id = req.params.id;
        conexion.all(`SELECT * FROM documento_ordinario_personal WHERE id = ${id}`, [], (error, results) => {
            if (error)
                throw error;
            if (results) {
                var path = require('path');
                res.status(200).sendFile(path.resolve('public/documento_ordinario_personal/' + results[0].imagen));
            }
        });
    } catch (error) {
        console.log(error);
    }
}

function deleteDocument(req, res) {
    const id = req.params.id;
    conexion.all(`SELECT * FROM documento_ordinario_personal WHERE id=${id}`, [], (err, result) => {
        if (err)
            return res.status(500).send({ message: err });
        if (result) {
            deleteFoto(result[0].imagen);
            conexion.all(`DELETE FROM documento_ordinario_personal WHERE id = ${id}`, [], (error, results) => {
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
    const pathViejo = `./public/documento_ordinario_personal/${imagen}`;
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
    var fecha = body.fecha;
    var procedencia = body.procedencia;
    var asunto = body.asunto;
    var destino = body.destino;
    var archivo = body.archivo;
    var foto = { name: null };
    var foto_name = '';
    if (req.files) foto = req.files.foto;
    foto_name = no + '.jpg';
    // Buscamos por id y actualizamos el objeto y devolvemos el objeto actualizado
    var query = `UPDATE documento_ordinario SET no=${no},fecha="${fecha}",procedencia="${procedencia}", asunto="${asunto}", destino="${destino}", destino="${destino}", archivo="${archivo}"`;
    if (foto.name != null) query += `,imagen="${no}.jpg `;
    query += `WHERE id = ${id}`

    conexion.all(query, [], (error, results) => {
        if (error)
            return res.status(500).send({ message: 'error en el servidor' });
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