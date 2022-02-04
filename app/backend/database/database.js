var sqlite3 = require('sqlite3').verbose()
// const path = 
const exec = require('child_process').exec;
const DBSOURCE = "db.sqlite"

exec('type nul > db.sqlite');
const conn = new SQLiteConnection("Data Source=MyDatabase.sqlite;Version=3;");
conn.SetPassword("password");

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.');
        // try {
        //     var lastID = 0;
        //     db.run(`SELECT id FROM usuarios ORDER BY id DESC`, (err, resp) => {
        //         lastID = resp[0];
        //     })
        //     bcrypt.hash("admin", 10, (err, encrypted) => {
        //         var insert_user = 'INSERT INTO usuarios (id, user, password, full_name, register_date, register_hour,avatar) VALUES (1,?,?,?,?,?,?)'
        //         db.run(insert_user, ["admin", encrypted, "Daniel Miller Gonzalez", "20 - 09 - 2021", "12:40 PM", "admin.jpg"]);
        //         var insert_rol = 'INSERT INTO roles(id, rol_name, description) VALUES (1,?,?)';
        //         db.run(insert_rol, ["admin", "Admin del programa puede comandar y ver todo"]);
        //         var insert_rol_usuario = 'INSERT INTO roles_usuarios(id, user_id, rol_id) VALUES (1,?,?)';
        //         db.run(insert_rol_usuario, [1, 1]);
        //         var insert_rol_permiso = 'INSERT INTO roles_permisos(id, rol_id, is_all, is_edit, is_create, is_delete, is_read) VALUES (1,?,?,?,?,?,?)';
        //         db.run(insert_rol_permiso, [1, 1, 1, 1, 1, 1]);
        //         var insert_user_online = 'INSERT INTO user_online (id, user_id, username, estado) VALUES (1,?,?,?)';
        //         db.run(insert_user_online, [1, 1, "admin", "activo"]);
        //     });
        // } catch (e) {
        //     console.log(e);
        // }
    }
});
module.exports = db