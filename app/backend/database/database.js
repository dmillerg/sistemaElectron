var sqlite3 = require('sqlite3').verbose()
// const path = 
const exec = require('child_process').exec;
const DBSOURCE = "db.sqlite"

exec('type nul > db.sqlite');


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.');
        [`CREATE TABLE IF NOT EXISTS "documento_clasificado" (
            "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            "no" INTEGER NOT NULL,
            "fecha" TEXT,
            "enviado" TEXT,
            "rsb" TEXT,
            "rs" TEXT,
            "fecha_registro_ctc" TEXT,
            "asunto" TEXT,
            "doc" TEXT,
            "ej" TEXT,
            "clasif" TEXT,
            "destino" text,
            "traslado" TEXT,
            "fecha_traslado" TEXT,
            "imagen" TEXT
          );`,
            `CREATE TABLE IF NOT EXISTS "documento_limitado" (
                "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                "no" INTEGER,
                "procedencia" TEXT,
                "titulo" TEXT,
                "fecha" TEXT NOT NULL,
                "movimiento1" TEXT,
                "movimiento2" TEXT,
                "destruccion" TEXT,
                "expediente" TEXT,
                "observacion" TEXT,
                "imagen" TEXT
              );`,
            `CREATE TABLE IF NOT EXISTS "documento_ordinario" (
                "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                "no" INTEGER NOT NULL,
                "fecha" TEXT NOT NULL,
                "enviado" TEXT,
                "rsb" TEXT,
                "rs" TEXT,
                "fecha_registro_ctc" TEXT,
                "asunto" TEXT,
                "destino" text,
                "traslado" TEXT,
                "fecha_traslado" TEXT,
                "imagen" TEXT
              );`,
            `CREATE TABLE IF NOT EXISTS "documento_ordinario_personal" (
                "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                "no" integer,
                "fecha" TEXT,
                "procedencia" TEXT,
                "asunto" TEXT,
                "destino" text,
                "archivo" TEXT,
                "imagen" TEXT
              );`,
            `CREATE TABLE IF NOT EXISTS "documento_secreto" (
                "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                "no" integer NOT NULL,
                "lugar" TEXT,
                "reg_no" text,
                "titulo" TEXT,
                "categoria" TEXT,
                "mat_no" INTEGER,
                "folio_no" INTEGER,
                "cant" integer,
                "no_ejemplar" INTEGER,
                "cant_hojas" integer,
                "destruccion" TEXT,
                "destino" text,
                "comp" TEXT,
                "imagen" TEXT
              );`,
            `CREATE TABLE IF NOT EXISTS "documentos" (
                "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                "title" TEXT NOT NULL,
                "descripcion" TEXT NOT NULL,
                "imagen" TEXT NOT NULL,
                "date" TEXT NOT NULL,
                "estado" TEXT NOT NULL
              );`,
            `CREATE TABLE IF NOT EXISTS "roles" (
                "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                "rol_name" TEXT NOT NULL,
                "description" TEXT NOT NULL,
                CONSTRAINT "rol_name" UNIQUE ("rol_name" ASC) ON CONFLICT ABORT
              );`,
            `CREATE TABLE IF NOT EXISTS "roles_permisos" (
                "id" INTEGER NOT NULL,
                "rol_id" integer NOT NULL,
                "is_all" integer NOT NULL,
                "is_create" integer NOT NULL,
                "is_edit" integer NOT NULL,
                "is_delete" integer NOT NULL,
                "is_read" integer NOT NULL,
                PRIMARY KEY ("id"),
                CONSTRAINT "rol_id" FOREIGN KEY ("rol_id") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
              );`,
            `CREATE TABLE IF NOT EXISTS "roles_usuarios" (
                "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                "user_id" integer NOT NULL,
                "rol_id" integer NOT NULL,
                CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "usuarios" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "rol_id" FOREIGN KEY ("rol_id") REFERENCES "roles_usuarios" ("rol_id") ON DELETE CASCADE ON UPDATE CASCADE
              );` ,
            `CREATE TABLE IF NOT EXISTS "user_history" (
                "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                "user_id" integer NOT NULL,
                "usuario" TEXT NOT NULL,
                "accion" TEXT NOT NULL,
                "fecha" TEXT NOT NULL,
                CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "user_history" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "usuario" FOREIGN KEY ("usuario") REFERENCES "user_history" ("usuario") ON DELETE CASCADE ON UPDATE CASCADE
              );`,
            `CREATE TABLE IF NOT EXISTS "user_online" (
                "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                "user_id" integer NOT NULL,
                "username" TEXT NOT NULL,
                "estado" TEXT NOT NULL,
                CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "user_online" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "username" FOREIGN KEY ("username") REFERENCES "user_online" ("username") ON DELETE CASCADE ON UPDATE CASCADE
              );`,
            `CREATE TABLE IF NOT EXISTS "usuarios" (
                "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                "user" TEXT NOT NULL,
                "password" TEXT NOT NULL,
                "full_name" TEXT,
                "register_date" TEXT,
                "register_hour" TEXT,
                "avatar" TEXT,
                CONSTRAINT "user" UNIQUE ("user" ASC) ON CONFLICT ABORT
              );`,
            `PRAGMA foreign_keys = true;`].map(sql => db.run(sql));


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