const conexion = require('../database/database');
const bcrypt = require('bcrypt');
const { json } = require('body-parser');

function getDocuments(req, res) {
    conexion.all(`SELECT * FROM documento_secreto`, [], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        if (results.length > 0) {
            return res.status(200).json(results);
        } else {
            return res.status(200).send({ documents: 'no existe ningun documento secreto' });
        }
    });
}

function saveDocument(req, res) {
    var id = -1;
    var body = req.body;
    var no = body.no;
    var lugar = body.lugar;
    var reg_no = body.reg_no;
    var titulo = body.titulo;
    var categoria = body.categoria;
    var mat_no = body.mat_no;
    var folio_no = body.folio_no;
    var cant = body.cant;
    var no_ejemplar = body.no_ejemplar;
    var cant_hojas = body.cant_hojas;
    var destruccion = body.destruccion;
    var destino = body.destino;
    var comp = body.comp;
    var foto = { name: null };
    var foto_name = '';
    if (req.files) foto = req.files.foto;
    foto_name = no + '.jpg';
    const parames = [no, lugar.toString(), reg_no.toString(), titulo.toString(), categoria.toString(), mat_no.toString(), folio_no.toString(), cant, no_ejemplar.toString(), cant_hojas.toString(), destruccion.toString(), destino.toString(), comp.toString(), foto_name];
    console.log('parametros  ', parames);
    conexion.all(`INSERT INTO documento_secreto(id, no, lugar, reg_no, titulo, categoria, mat_no, folio_no, cant, no_ejemplar, cant_hojas, destruccion, destino, comp, imagen) VALUES (NULL,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, parames, (error) => {
        if (error) {
            console.log('error', error);
            return res.status(500).send({ message: error });
        }
        saveFoto(foto, foto_name);
        return res.status(201).send({ message: 'documento secreto  guardado correctamente' });

    });
}


function saveFoto(foto, title) {
    if (foto.name != null) {
        foto.mv(`./public/documento_secreto/${title}`, function(err) {
            console.log('Error con la foto', err);
        });
    }
}

function getFoto(req, res) {
    try {
        var id = req.params.id;
        conexion.all(`SELECT * FROM documento_secreto WHERE id = ${id}`, [], (error, results) => {
            if (error)
                throw error;
            if (results) {
                var path = require('path');
                res.status(200).sendFile(path.resolve('public/documento_secreto/' + results[0].imagen));
            }
        });
    } catch (error) {
        console.log(error);
    }
}

function deleteDocument(req, res) {
    const id = req.params.id;
    conexion.all(`SELECT * FROM documento_secreto WHERE id=${id}`, [], (err, result) => {
        if (err)
            return res.status(500).send({ message: err });
        if (result) {
            deleteFoto(result[0].imagen);
            conexion.all(`DELETE FROM documento_secreto WHERE id = ${id}`, [], (error, results) => {
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
    const pathViejo = `./public/documento_secreto/${imagen}`;
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
    var lugar = body.lugar;
    var reg_no = body.reg_no;
    var titulo = body.titulo;
    var categoria = body.categoria;
    var mat_no = body.mat_no;
    var folio_no = body.folio_no;
    var cant = body.cant;
    var no_ejemplar = body.no_ejemplar;
    var cant_hojas = body.cant_hojas;
    var destruccion = body.destruccion;
    var destino = body.destino;
    var comp = body.comp;
    var foto = { name: null };
    var foto_name = '';
    if (req.files) foto = req.files.foto;
    foto_name = no + '.jpg';
    // Buscamos por id y actualizamos el objeto y devolvemos el objeto actualizado
    var query = `UPDATE documento_secreto SET no=${no},lugar="${lugar}",reg_no="${reg_no}", titulo="${titulo}", categoria="${categoria}", mat_no="${mat_no}", folio_no="${folio_no}",cant="${cant}", no_ejemplar="${no_ejemplar}", cant_hojas="${cant_hojas}", destruccion="${destruccion}", destino="${destino}", comp="${comp}"`;
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