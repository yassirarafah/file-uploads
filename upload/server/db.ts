
var sqlite3 = require("sqlite3").verbose(),
TransactionDatabase = require("sqlite3-transactions").TransactionDatabase;

const DBSOURCE = "imagesdb.sqlite";

var db = new TransactionDatabase(
new sqlite3.Database(DBSOURCE, (err: { message: any; }) => {
if (err) {
  // Cannot open database
  console.error(err.message)
  throw err
} 
else {
    // ** EXAMPLE **
    // ** For a column with unique values **
    // email TEXT UNIQUE, 
    // with CONSTRAINT email_unique UNIQUE (email) 
    db.run(`CREATE TABLE Users (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,              
        Username TEXT,             
        DateModified DATE,
        DateCreated DATE
        )`,
    (err: any) => {
        if (err) {
            // Table already created
        }else{
            // Table just created, creating some rows
            var insert = 'INSERT INTO Users (Username, DateCreated) VALUES (?,?)'
            db.run(insert, ["lisa33",  Date()])
            db.run(insert, ["craig44", Date()])
            db.run(insert, ["alan54",  Date()])
            db.run(insert, ["tracy65", Date()])
        }
    });  
   
    db.run(`CREATE TABLE UserImages (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        UserId INTEGER,   
        Username TEXT,                      
        Mimetype TEXT,                         
        Filename TEXT,                         
        Size INTEGER,                         
        DateModified DATE,
        DateCreated DATE
        )`,
    (err: any) => {
        if (err) {
            // Table already created
        }
    });  
}
})
);

module.exports = db 