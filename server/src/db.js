import {createConnection} from "mysql"

export const db_conn = createConnection({
    password:"1234",
    port:"3306",
    database:"botas",
    host:"127.0.0.1",
    user:"root"
})