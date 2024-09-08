--
-- Archivo generado con SQLiteStudio v3.4.4 el dom. sept. 8 13:18:54 2024
--
-- Codificación de texto usada: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Tabla: Users
CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY, mongo_id TEXT, name TEXT, surname TEXT, age INTEGER, email TEXT);
INSERT INTO Users (id, mongo_id, name, surname, age, email) VALUES (1, '66dde2bbf5e89cdfe6796c21', 'Camilo', 'Franco', 19, 'camilo@gmail.com');
INSERT INTO Users (id, mongo_id, name, surname, age, email) VALUES (2, '66dde2eaf5e89cdfe6796c25', 'Andres', 'Duran', 19, 'andres@gmail.com');
INSERT INTO Users (id, mongo_id, name, surname, age, email) VALUES (3, '66dde9a2e5299b54147d12fa', 'Luna', 'Luna', 22, 'luna@gmail.com');

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
