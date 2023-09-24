import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

export const getNewConnection = () => {
  return new Promise((resolve, reject) => {
    const con = mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
    });
    con.connect(function (err) {
      if (err) reject(err);
      resolve(con);
    });
  });
};

