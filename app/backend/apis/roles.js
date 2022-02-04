const conexion = require('../database/database');

function saveRol(req, res) {

    // Recogemos los parametros del body
    var body = req.body;
    var rol_name = body.rol_name;
    var description = body.description;

    conexion.all(`INSERT INTO roles(id, rol_name, description) VALUES (NULL,"${rol_name}","${description}")`, [], (error, results) => {
        if (error)
            return res.status(500).send({ message: error });
        if (results) {
            return res.status(201).json(results);
        } else {
            return res.status(400).send({ message: 'Datos mal insertados' });
        }
    });
}


function getRolesPermisos(req, res) {

    var body = req.query;
    var user_id = req.params.user_id;
    var rol_name = body.rol_name;
    var usuario = body.usuario;
    var description = body.description;

    var query = `SELECT roles_permisos.*, usuarios.user, roles.rol_name FROM roles_permisos JOIN roles ON roles_permisos.rol_id=roles.id JOIN roles_usuarios ON roles_usuarios.rol_id=roles.id JOIN usuarios ON roles_usuarios.user_id=usuarios.id  WHERE 1 `;
    if (user_id && user_id != 'Admin') {
        query += `AND usuarios.id=${user_id} `;
    }
    if (usuario && usuario != '') {
        query += `AND usuarios.user LIKE "%${usuario}%" `;
    }
    if (rol_name && rol_name != '') {
        query += `AND rol_name LIKE "%${rol_name}%" `;
    }

    query += ` group by usuarios.user`
    conexion.all(query, [], (error, results) => {
        if (error)
            return res.status(500).send({ message: 'Error en el servidor' });
        if (results.length > 0) {
            return res.status(200).json(results);
        } else {
            return res.status(200).send({ message: 'No hay roles' });
        }
    });

}

function getRoles(req, res) {

    var body = req.query;
    var rol_name = body.rol_name;
    var description = body.description;

    var query = `SELECT * FROM roles WHERE 1 `;

    if (rol_name && rol_name != '') {
        query += `AND rol_name LIKE "%${rol_name}%" `;
    }
    if (description && description != '') {
        query += `AND description LIKE "%${description}%" `;
    }


    conexion.all(query, [], (error, results) => {
        if (error)
            return res.status(500).send({ message: 'Error en el servidor' });
        if (results.length > 0) {
            return res.status(200).json(results);
        } else {
            return res.status(200).send({ message: 'No hay roles' });
        }
    });
}


function updateRol(req, res) {
    // Recogemos un parámetro por la url
    var id = req.params.id;
    // Recogemos los datos que nos llegen en el body de la petición
    var body = req.body;
    var rol_name = body.rol_name;
    var description = body.description;

    // Buscamos por id y actualizamos el objeto y devolvemos el objeto actualizado
    let query = `UPDATE roles SET rol_name="${rol_name}",description="${description}" WHERE id = ${id}`;
    conexion.all(query, [], (error, results) => {
        if (error)
            return res.status(500).send({ message: 'error en el servidor' });
        if (results) {
            return res.status(200).json(results);
        } else {
            return res.status(404).send({ message: 'no existe ningun rol con ese id' });
        }
    });
}

function deleteRol(req, res) {
    var id = req.params.id;
    // Buscamos por id y actualizamos el objeto y devolvemos el objeto actualizado
    conexion.all(`DELETE FROM roles WHERE id = ${id}`, [], (error, results) => {
        if (error)
            return res.status(500).send({ message: 'error en el servidor' });
        if (results) {
            return res.status(200).json(results);
        } else {
            return res.status(404).send({ message: 'no existe ningun rol con ese id' });
        }
    });
}

function addRolesPermisos(req, res) {
    // console.log(req, res);
    var id = req.params.rol_id;
    var body = req.body;
    var is_all = body.is_all;
    var is_edit = body.is_edit;
    var is_create = body.is_create;
    var is_delete = body.is_delete;
    var is_read = body.is_read;

    conexion.all(`SELECT * FROM roles_permisos WHERE rol_id=${id}`, [], (error, result) => {
        if (error) {
            return res.status(500).send({ message: 'error con el servidor' });
        }
        if (result.length > 0) {
            conexion.all(`UPDATE roles_permisos SET is_all=${is_all},is_edit=${is_edit},is_create=${is_create},is_delete=${is_delete},is_read=${is_read} WHERE rol_id = ${id}`);
            return res.status(200).send({ message: "Updated" });
        } else {
            var query = `INSERT INTO roles_permisos(id, rol_id, is_all, is_edit, is_create, is_delete, is_read) VALUES (NULL,${id},${is_all},${is_edit},${is_create},${is_delete},${is_read})`;
            conexion.all(query, [], (errors, results) => {
                if (errors)
                    return res.status(500).send({ message: 'error en el servidor' });
                if (results) {
                    return res.status(200).json(results);
                } else {
                    return res.status(404).send({ message: 'no existe ningun rol con ese id' });
                }
            });
        }
    });


}

function getRolesByUser(req, res) {
    var id = req.params.user_id;
    var query = `SELECT roles.* FROM roles JOIN roles_usuarios ON roles.id=roles_usuarios.rol_id WHERE roles_usuarios.user_id=${id}`;
    conexion.all(query, [], (error, results) => {
        if (error)
            return res.status(500).send({ message: error });
        if (results.length > 0) {
            return res.status(200).json(results);
        } else {
            return res.status(404).send({ message: 'el usuario no tiene roles asignados' });
        }
    });
}

function getPermisosRol(req, res) {
    var id = req.params.rol_id;
    var query = `SELECT roles_permisos.* FROM roles_permisos JOIN roles ON roles.id=roles_permisos.rol_id WHERE roles_permisos.rol_id=${id}`;
    conexion.all(query, [], (error, results) => {
        if (error)
            return res.status(500).send({ message: error });
        if (results.length > 0) {
            return res.status(200).json(results);
        } else {
            return res.status(404).send({ message: 'el rol no tiene permisos asignados' });
        }
    });
}

function RolbyRolName(req, res) {
    console.log(req.params);
    var rol_name = req.params.rolname;
    console.log(rol_name);
    var query = `SELECT * FROM roles WHERE rol_name="${rol_name}"`;
    conexion.all(query, [], (error, results) => {
        if (error)
            return res.status(500).send({ message: error });
        if (results)
            return res.status(200).send(results);
    });
}

module.exports = {
    saveRol,
    getRolesPermisos,
    getRoles,
    updateRol,
    deleteRol,
    addRolesPermisos,
    getRolesByUser,
    getPermisosRol,
    RolbyRolName,
};