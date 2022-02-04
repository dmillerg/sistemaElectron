'use strict'

// Cargamos el módulo de express para poder crear rutas
var express = require('express');

// Cargamos el controlador
var usuario_controller = require('./apis/usuarios');
var roles_controller = require('./apis/roles');
var login_controller = require('./apis/login');
var document_controller = require('./apis/documents');
// var managedb_controller = require('./apis/');
var superuser_controller = require('./database/superuser');
var historico_controller = require('./apis/historico');
var clasificado_controller = require('./apis/documento-clasificado');
var limitado_controller = require('./apis/documento-limitado');
var ordinario_personal_controller = require('./apis/documento-ordinario-personal');
var ordinario_controller = require('./apis/documento-ordinario');
var secretos_controller = require('./apis/documento-secretos');

// Llamamos al router
var api = express.Router();

//Rutas para las api de roles
api.get('/roles', roles_controller.getRoles);
api.post('/roles', roles_controller.saveRol);
api.post('/roles/:id', roles_controller.updateRol);
api.delete('/roles/:id', roles_controller.deleteRol);
api.post('/rolesypermisos/:rol_id', roles_controller.addRolesPermisos);
api.get('/rolesypermisos/:user_id', roles_controller.getRolesPermisos);
api.get('/rolesbyuser/:user_id', roles_controller.getRolesByUser);
api.get('/rolypermisos/:rol_id', roles_controller.getPermisosRol);
api.get('/rolbyrolname', roles_controller.RolbyRolName);


// Rutas para las api de usuario
api.post('/saveUsuario', usuario_controller.saveUsuario);
api.get('/usuarios', usuario_controller.getUsuarios);
api.get('/usuarios/:id', usuario_controller.getUsuario);
api.post('/usuarios/:id', usuario_controller.updateUsuario);
api.delete('/usuarios/:id', usuario_controller.deleteUsuario);
api.get('/avatar/:id', usuario_controller.getAvatar);
api.delete('/avatar/:id', usuario_controller.deleteAvatarApi);
api.get('/userhistory/:id', usuario_controller.getUserHistory);

//Rutas para la api de login
api.post('/login', login_controller.login);
api.get('/login', login_controller.hola);
api.delete('/logout/:id', login_controller.logout);
api.get('/useronline', login_controller.userOnline);

//Rutas para el api de documentos
api.get('/documents/:id', document_controller.getDocuments);
api.post('/documents', document_controller.saveDocument);
api.get('/documentsFoto/:id', document_controller.getFoto);
api.delete('/documents/:id', document_controller.deleteDocument);
api.post('/documents/:id', document_controller.updateDocument);

//Rutas para manejar base de datos
// api.get('/database', managedb_controller.createTables);

//Rutas para crear el primer superuser
api.post('/superuser', superuser_controller.saveSuperUsuario);

//Rutas para historico
api.post('/userhistory', historico_controller.saveActionAPI);

//Rutas para el api de documentos clasificados
api.get('/clasificado/:id', clasificado_controller.getDocuments);
api.post('/clasificado', clasificado_controller.saveDocument);
api.get('/clasificadoFoto/:id', clasificado_controller.getFoto);
api.delete('/clasificado/:id', clasificado_controller.deleteDocument);
api.post('/clasificado/:id', clasificado_controller.updateDocument);

//Rutas para el api de documentos limitados
api.get('/limitado/:id', limitado_controller.getDocuments);
api.post('/limitado', limitado_controller.saveDocument);
api.get('/limitadoFoto/:id', limitado_controller.getFoto);
api.delete('/limitado/:id', limitado_controller.deleteDocument);
api.post('/limitado/:id', limitado_controller.updateDocument);

//Rutas para el api de documentos ordinario personal
api.get('/ordinario-personal/:id', ordinario_personal_controller.getDocuments);
api.post('/ordinario-personal', ordinario_personal_controller.saveDocument);
api.get('/ordinario-personalFoto/:id', ordinario_personal_controller.getFoto);
api.delete('/ordinario-personal/:id', ordinario_personal_controller.deleteDocument);
api.post('/ordinario-personal/:id', ordinario_personal_controller.updateDocument);

//Rutas para el api de documentos ordinario
api.get('/ordinario/:id', ordinario_controller.getDocuments);
api.post('/ordinario', ordinario_controller.saveDocument);
api.get('/ordinarioFoto/:id', ordinario_controller.getFoto);
api.delete('/ordinario/:id', ordinario_controller.deleteDocument);
api.post('/ordinario/:id', ordinario_controller.updateDocument);

//Rutas para el api de documentos secretos
api.get('/secreto/:id', secretos_controller.getDocuments);
api.post('/secreto', secretos_controller.saveDocument);
api.get('/secretoFoto/:id', secretos_controller.getFoto);
api.delete('/secreto/:id', secretos_controller.deleteDocument);
api.post('/secreto/:id', secretos_controller.updateDocument);

// Exportamos la configuración
module.exports = api;