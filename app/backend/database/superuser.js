const bcrypt = require('bcrypt');
const conexion = require('./database');

function saveSuperUsuario(req, res) {
    console.log('request superuser', req.body)
    const user = req.body.user;
    const pass = req.body.pass;
    const confirm = req.body.confirm;
    var id = -1;
    var rol_id = -1;
    if (pass != confirm) return res.status(400).send({ message: 'error' });
    bcrypt.hash(pass, 10, (err, encrypted) => {
        if (err) {
            console.log(err);
            return res.status(400).send({ message: err });
        } else {
            conexion.all('INSERT INTO USUARIOS (id,user,password,full_name,register_date,register_hour,avatar) VALUES (NULL,?,?,?,?,?,?)', [user, encrypted, 'ADMIN', '  ', '  ', '   '], (err) => {
                if (err) {
                    return res.status(500).send({ message: err, error: 'Error en obtener last id generado' });
                }
                conexion.all('SELECT ID,USER FROM USUARIOS ORDER BY ID DESC LIMIT 1', (err1, result1) => {
                    if (err1) return res.status(400).send({ message: err1, error: 'Error en obtener last id generado' });
                    if (result1) {
                        console.log(result1);
                        id = result1[0].id;
                        conexion.all('INSERT INTO ROLES(id , rol_name, description) VALUES (NULL,?,?)', ['admin', 'ADMIN DE TODO EL PROGAMA']);
                        conexion.all('SELECT ID FROM ROLES WHERE ROL_NAME="admin" ORDER BY ID DESC LIMIT 1', (err2, result2) => {
                            if (err2) return res.status(500).send({ message: err, error: 'Error en seleccionar el ultimo id de rol generado' });
                            if (result2) {
                                rol_id = result2[0].id;
                                conexion.all('INSERT INTO roles_permisos(id, rol_id, is_all, is_edit, is_create, is_delete, is_read) VALUES (1,?,?,?,?,?,?)', [rol_id, 1, 1, 1, 1, 1]);
                                conexion.all('INSERT INTO ROLES_USUARIOS(id, user_id, rol_id) VALUES (NULL, ?, ?)', [id, rol_id], (err3) => {
                                    if (err3) return res.status(400).send({ message: err1, error: 'Error al insertar en la tabla roles_usuarios' });
                                    conexion.all('INSERT INTO USER_ONLINE(id, user_id, username, estado) VALUES (NULL, ?, ?, ?)', [id, user, 'inactivo'], (err4) => {
                                        if (err4) return res.status(500).send({ message: err4, error: 'Error a la hora de insertar en la tabla de user_online' });
                                        return res.status(200).send({ message: `Superuser ${user} creado correctamente con pass ${pass}` });
                                    });
                                });
                            }
                        });
                    }
                });
            });
        }
    });
}



module.exports = {
    saveSuperUsuario,
}