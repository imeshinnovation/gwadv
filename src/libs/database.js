const sqlite3 = require('sqlite3')
const bcrypt = require('bcrypt');
const MailMessage = require('nodemailer/lib/mailer/mail-message');

const database = {
    running: () => {
        new sqlite3.Database('./src/db/gwadv.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err && err.code == "SQLITE_CANTOPEN") {
                module.exports.createDatabase();
                return;
            } else if (err) {
                console.log("Getting error " + err);
            }
            //runQueries(db);
        });
    },
    createDatabase: () => {
        var newdb = new sqlite3.Database('./src/db/gwadv.db', (err) => {
            if (err) {
                console.log("Getting error " + err);
            }
            module.exports.createTables(newdb);
        });
    },
    createTables: (newdb) => {
        newdb.exec(`
        create table logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            well_name TEXT,
            event TEXT,
            type_event NUMBER,
            datetime TEXT
        );
        create table users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            names TEXT NOT NULL,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            roll INTEGER NOT NULL
        );
        create table pozos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            ubicacion TEXT NOT NULL,
            estado INTEGER NOT NULL
        );
        create table dsn (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            conexion TEXT NOT NULL
        );
        create table query (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cadena TEXT NOT NULL
        );
        create table trigger (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            disparador TEXT NOT NULL
        );
        INSERT INTO users
        (names,email,password,roll)
        VALUES
        ('Administrador','admin@global','$2b$10$7BorDlKDMcRf4ie5133heeGz/yZTH671hBpRRHJthd.HPdA8Dg0Pe', 1);
        `, () => {
            //runQueries(newdb);
        });
    },
    conn: () => {
        let newdb = new sqlite3.Database('./src/db/gwadv.db', (err) => {
            if (err) {
                console.log("Getting error " + err);
            }
            module.exports.running();
        });
        return newdb;
    },
    queryAll: async (table) => {
        let gwdb = module.exports.conn()
        return new Promise((resolve, reject) => {
            gwdb.all(`SELECT * FROM ${table}`, (err, data) => {
                if (err) return reject(err)
                return resolve(data)
            })
            gwdb.close()
        })

    },
    queryParams: async (table, params) => {
        let gwdb = module.exports.conn()
        return new Promise((resolve, reject) => {
            gwdb.all(`SELECT * FROM ${table} WHERE ${params}`, (err, data) => {
                if (err) return reject(err)
                return resolve(data)
            })
            gwdb.close()
        })
    },
    insertData: async (table, columns, values) => {
        let gwdb = module.exports.conn()
        gwdb.exec(`INSERT INTO ${table} (${columns}) VALUES (${values})`)
        gwdb.close()
    },
    updateData: async (table, update, query) => {
        let gwdb = module.exports.conn()
        gwdb.exec(`UPDATE ${table} SET ${update} WHERE ${query}`)
        gwdb.close()
    },
    deleteData: async (table, query) => {
        let gwdb = module.exports.conn()
        gwdb.exec(`DELETE FROM ${table} WHERE ${query}`)
        gwdb.close()
    },
    encryptPassword: (password) => {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    },
    comparePassword: (password, passwd) => {
        return bcrypt.compareSync(password, passwd)
    }
}

module.exports = database