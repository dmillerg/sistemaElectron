const conexion = require('../database/database');
const bcrypt = require('bcrypt');
const { json } = require('body-parser');
const params = [];

function saveUsuario(req, res) {
    // Recogemos los parametros del body
    var id = -1;
    var body = req.body;
    var user = body.user;
    var password = body.password;
    var full_name = body.full_name;
    var register_date = body.register_date;
    var register_hour = body.register_hour;
    var avatar = { name: null };
    if (req.files) avatar = req.files.avatar;

    var roles = JSON.parse(body.roles);
    console.log(roles);

    bcrypt.hash(password, 10, (err, encrypted) => {
        if (err) {
            console.log(err);
        } else {
            const query = `INSERT INTO usuarios(id, user, password, full_name, register_date, register_hour,avatar) VALUES (NULL,"${user}","${encrypted}","${full_name}","${register_date}", "${register_hour}","${user}.jpg")`;
            conexion.all(query, params, (err, results) => {
                if (err)
                    return res.status(500).send({ message: error });
                if (results) {
                    conexion.all(`SELECT id FROM usuarios ORDER BY id DESC`, [], (err, resp) => {
                        if (err) {
                            console.log('Error asda', err)
                        }
                        console.log(resp)
                        if (resp != undefined) {
                            id = resp[0].id;

                            let queryUserOnline = `INSERT INTO user_online(id, user_id, username, estado) VALUES (NULL, ${id}, "${user}","inactivo")`;
                            conexion.all(queryUserOnline, [], (error2, result2) => {
                                if (error2) console.log('error', error2);
                                if (result2) console.log('resp', result2);
                            });
                            for (let rol of roles) {
                                query_rol = `INSERT INTO roles_usuarios(id, user_id, rol_id) VALUES (NULL, ${id}, ${rol.id})`;
                                conexion.all(query_rol, [], (error, results) => {
                                    if (error)
                                        console.log(error);
                                    if (results) {
                                        console.log("result", results);
                                    } else {
                                        // console.log('asda');
                                    }
                                });
                            }
                            saveAvatar(avatar, user);
                        }
                    });
                    return res.status(201).send({ message: 'agregado correctamente' });
                } else {
                    return res.status(400).send({ message: 'Datos mal insertados' });
                }
            });
        }
    });
}


function getUsuarios(req, res) {
    console.log('hola');

    var body = req.query;
    var user = body.user;
    var full_name = body.full_name;
    var register_date = body.register_date;
    var register_hour = body.register_hour;

    var query = `SELECT * FROM usuarios WHERE 0=0 `;


    if (user) {
        query += `AND user LIKE "%${user}%" `;
    }
    if (full_name) {
        query += `AND full_name LIKE "%${full_name}%"`;
    }
    if (register_date) {
        query += `AND register_date LIKE "%${register_date}%"`;
    }
    if (register_hour) {
        query += `AND register_hour LIKE "%${register_hour}%"`;
    }
    conexion.all(query, [], (error, results) => {
        if (error)
            return res.status(500).send({ message: 'Error en el servidor' });
        if (results.length > 0) {
            return res.status(200).json(results);
        } else {
            return res.status(200).send({ message: 'No hay usuarios' });
        }
    });

}

function getUsuario(req, res) {
    // Recogemos un parametro por la url
    var id = req.params.id;
    const query = `SELECT * FROM usuarios WHERE id = ${id}`;
    conexion.all(query, params, (error, results) => {
        if (error)
            throw error;
        if (results.length > 0) {
            return res.status(302).json(results);
        } else {
            return res.status(200).send({ canal: 'no existe ningun usuario con ese id' });
        }
    });
}



function updateUsuario(req, res) {
    // Recogemos un parámetro por la url
    var id = req.params.id;

    // Recogemos los datos que nos llegen en el body de la petición
    var update = req.body;
    var user = update.user;
    var password = update.password;
    var full_name = update.full_name;
    var roles = JSON.parse(update.roles);

    var avatar = { name: null };
    if (req.files) avatar = req.files.avatar;
    console.log(avatar.name)
    console.log(roles);
    // Buscamos por id y actualizamos el objeto y devolvemos el objeto actualizado

    const query = `UPDATE usuarios SET user="${user}",password="${password}",full_name="${full_name}",avatar="${user}.jpg" WHERE id = ${id}`;
    conexion.all(query, params, (error, results) => {
        if (error)
            return res.status(500).send({ message: 'error en el servidor' });
        if (results) {
            saveAvatar(avatar, user);
            const query2 = `DELETE FROM roles_usuarios WHERE user_id=${id}`;
            conexion.all(query2);
            for (let rol of roles) {
                console.log("roles", rol)
                query_rol = `INSERT INTO roles_usuarios(id, user_id, rol_id) VALUES (NULL, ${id}, ${rol.id})`;
                conexion.all(query_rol, params, (error, results) => {
                    if (error)
                        console.log(error);
                    if (results) {
                        console.log("result", results);
                    } else {
                        // console.log('asda');
                    }
                });
            }
            return res.status(201).send({ message: 'agregado correctamente' });
        } else {
            return res.status(404).send({ message: 'no existe ningun usuario con ese id' });
        }
    });

}

function deleteUsuario(req, res) {
    var id = req.params.id;
    // Buscamos por id y actualizamos el objeto y devolvemos el objeto actualizado
    const query = `SELECT * FROM usuarios WHERE id = ${id}`;
    conexion.all(query, params, (error, result) => {
        if (result) {
            deleteAvatar(result.user);
            const query_delete = `DELETE FROM usuarios WHERE id = ${id}`;
            conexion.all(query_delete, params, (error, results) => {
                if (error)
                    return res.status(500).send({ message: 'error en el servidor' });
                if (results) {
                    conexion.all(`DELETE FROM user_online WHERE user_id = ${id}`);
                    deleteUserRol(id);
                    return res.status(200).json(results);
                } else {
                    return res.status(404).send({ message: 'no existe ningun usuario con ese id' });
                }
            });
        }
    });

}

function deleteUserRol(id) {
    const query = `DELETE FROM roles_usuarios WHERE user_id = ${id}`;
    conexion.all(query, params, (error, results) => {
        if (error)
            return error;
        if (results) {
            return results
        }
    });
}

function getAvatar(req, res) {
    try {
        var id = req.params.id;
        const query = `SELECT * FROM usuarios WHERE id = ${id}`;
        conexion.all(query, params, (error, results) => {
            if (error)
                throw error;
            if (results.length > 0) {
                var path = require('path');
                res.sendFile(path.resolve('public/images-avatar/' + results[0].avatar));
            } else {
                return res.status(404).send({ canal: 'no existe ningun usuario con ese id' });
            }
        });
    } catch (error) {
        console.log(error);
    }
}

function deleteAvatarApi(req, res) {
    const id = req.params.id;
    const query = `SELECT * FROM usuarios WHERE id=${id}`;
    conexion.all(query, params, (error, result) => {
        if (result) {
            deleteAvatar(result[0].user);
            const query2 = `UPDATE usuarios SET avatar="" WHERE id = ${id}`;
            conexion.all(query2, params, (error, result) => {
                if (error) {
                    return res.status(500).send({ message: 'ocurrio un problema en el servidor' });
                }
                if (result) {
                    return res.status(200).send({ message: 'avatar eliminado correctamente' });
                }
            });
        }
    });
}

function deleteAvatar(user) {
    const pathViejo = `./public/images-avatar/${user}.jpg`;
    // console.log(pathViejo);
    const fs = require("fs");
    if (fs.existsSync(pathViejo)) {
        console.log("borrado");
        fs.unlinkSync(pathViejo);
    }
    return "borrado correctamente";
}

function saveAvatar(avatar, usuario) {
    if (avatar.name != null) {
        // console.log("agregando foto", usuario);
        avatar.mv(`./public/images-avatar/${usuario}.jpg`, function(err) {});
    }
}

function getUserHistory(req, res) {
    const id = req.params.id;
    let query = `SELECT * FROM user_history WHERE user_id=${id} ORDER BY id DESC`;
    conexion.all(query, params, (error, result) => {
        if (error) {
            return res.status(500).send({ message: 'Error interno del servidor por favor intentelo mas tarde' });
        }
        if (result) {
            res.status(200).send(result);
        }
    })
}


module.exports = {
    saveUsuario,
    getUsuarios,
    getUsuario,
    updateUsuario,
    deleteUsuario,
    getAvatar,
    deleteAvatarApi,
    getUserHistory,
};