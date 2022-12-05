import mysql from 'mysql';

// let mysqlConnection = createConnection;

// export const init = () => {
//     try {
//       mysqlConnection = createConnection({
//         connectionLimit:4 ,
//         host: "localhost",
//         user: "root" ,
//         password: "root123" ,
//         database: "practical" ,
//       });
  
//       console.log('MySql Adapter Pool generated successfully');
//     } catch (error) {
//       console.log('[mysql.connector][init][Error]: ', error);
//       throw new Error('failed to initialized pool');
//     }
//   };

let mysqlConnection:any  = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root123",
    database:"practical"
});

mysqlConnection.connect((err:any )=>{
    if (!err){
        console.log("connected")
    } else{
        console.log("connection failed")
    }
});

export {mysqlConnection};