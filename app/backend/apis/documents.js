const conexion = require('../database/database');
const bcrypt = require('bcrypt');
const { json } = require('body-parser');

function getDocuments(req, res) {
    var id = req.params.id;
    var visibility = req.query.filtro_visibility;
    var estado = 0;
    var query = ``;
    if (visibility == 'private') estado = 1;
    if (visibility != 'pyp') query = `WHERE estado=${estado}`;
    conexion.all(`SELECT * FROM documentos ` + query, [], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        if (results.length > 0) {
            return res.status(200).json(results);
        } else {
            return res.status(200).send({ documents: 'no existe ningun documento permitido' });
        }
    });
}

function saveDocument(req, res) {
    var id = -1;
    var body = req.body;
    var title = body.title;
    var descripcion = body.descripcion;
    var date = body.date;
    var estado = 0;
    if (body.estado == 'true') estado = 1;
    var foto = { name: null };
    if (req.files) foto = req.files.foto;
    foto_name = title + '.jpg';

    conexion.all(`INSERT INTO documentos(id, title, descripcion, imagen, date, estado) VALUES (NULL,"${title}","${descripcion}","${foto_name}","${date}","${estado}")`, [], (error, results) => {
        if (error)
            return res.status(500).send({ message: error });
        if (results) {
            saveFoto(foto, title);
            return res.status(201).send({ message: 'documento guardado correctamente' });
        }
    });
}


function saveFoto(foto, title) {
    if (foto.name != null) {
        foto.mv(`./public/documents/${title}.jpg`, function(err) {});
    }
}

function getFoto(req, res) {
    try {
        var id = req.params.id;
        conexion.all(`SELECT * FROM documentos WHERE id = ${id}`, [], (error, results) => {
            if (error)
                throw error;
            if (results.length > 0) {
                var path = require('path');
                res.sendFile(path.resolve('public/documents/' + results[0].imagen));
            } else {
                return res.status(404).send({ documento: 'no existe ningun documento con ese id' });
            }
        });
    } catch (error) {
        console.log(error);
    }
}

function deleteDocument(req, res) {
    const id = req.params.id;
    conexion.all(`SELECT * FROM documentos WHERE id=${id}`, [], (err, result) => {
        if (err)
            return res.status(500).send({ message: err });
        if (result) {
            deleteFoto(result[0].imagen);
            conexion.all(`DELETE FROM documentos WHERE id = ${id}`, [], (error, results) => {
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
    const pathViejo = `./public/documents/${imagen}`;
    // console.log(pathViejo);
    const fs = require("fs");
    if (fs.existsSync(pathViejo)) {
        console.log("borrado");
        fs.unlinkSync(pathViejo);
    }
    return "borrardo correctamente";
}

function updateDocument(req, res) {
    // Recogemos un parámetro por la url
    var id = req.params.id;

    // Recogemos los datos que nos llegen en el body de la petición
    var update = req.body;
    var title = update.title;
    var descripcion = update.descripcion;
    var imagen = update.imagen;
    var date = update.date;
    var estado = 0;
    if (update.estado == 'true') estado = 1;

    var foto = { name: null };
    if (req.files) foto = req.files.foto;
    console.log(foto.name, 'foto');
    // Buscamos por id y actualizamos el objeto y devolvemos el objeto actualizado
    var query = `UPDATE documentos SET title="${title}",descripcion="${descripcion}",date="${date}", estado="${estado}"`;
    if (foto.name != null) query += `,imagen="${title}.jpg `;
    query += `WHERE id = ${id}`

    conexion.all(query, [], (error, results) => {
        if (error)
            return res.status(500).send({ message: 'error en el servidor' });
        if (results) {
            if (foto.name != null) {
                deleteFoto(title + '.jpg');
                saveFoto(foto, title);
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