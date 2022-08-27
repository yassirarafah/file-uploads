import express from "express";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
var db = require("../db");
var mime = require('mime-types')

let instance: null | FileController = null;

class FileController {
  static getInstance(): FileController {
    if (instance === null) {
      instance = new FileController();
      return instance;
    }

    return instance;
  }

  async getAllImages(request: express.Request, response: express.Response) {
    var sql = "SELECT * FROM UserImages";
    db.all(sql, (err: { message: any }, rows: string | any[]) => {
      if (err) {
        response.status(400).json({ error: err.message });
        return;
      }

      response.json({
        files: rows,
      });
    });
  }

  async uploadFile(request: express.Request, response: express.Response) {
    try {
      var file = request.files as Express.Multer.File[];
      var fileCount = 0;

      var isUserExists = true;

      var sql = "SELECT * FROM Users WHERE Id = ?";
      db.all(
        sql,
        request.body.UserId,
        (err: { message: any }, rows: string | any[]) => {
          if (err) {
            response.status(400).json({ error: err.message });
            return;
          }
          
          isUserExists = rows.length > 0 ? true : false;
        

          if (isUserExists) {
            var dir = `./uploads/${request.body.UserId}/`;

            file.forEach((element) => {
              if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
              }
              var newFileName = `${uuidv4()}.${mime.extension(element.mimetype)}`;
              var newPath = `./uploads/${request.body.UserId}/${newFileName}`;
              var imageBinary = element.buffer;
              var user = rows[0];
              try {
                fs.writeFile(
                  newPath,
                  imageBinary,
                  "base64",
                  function (err: any) {}
                );
              } catch (error) {
                console.log(error);
              }
              var data = {
                UserId: request.body.UserId,
                Filename: `${request.body.UserId}/${newFileName}`,
                Mimetype: element.mimetype,
                Size: element.size,
                Username: user.Username,
                DateCreated: Date(),
              };
              var sql =
                "INSERT INTO UserImages (UserId, Filename,Username, Mimetype, Size, DateCreated) VALUES (?,?,?,?,?,?)";
              var params = [
                data.UserId,
                data.Filename,
                data.Username,
                data.Mimetype,
                data.Size,
                Date(),
              ];

              db.run(
                sql,
                params,
                function (err: { message: any }, result: any) {
                  if (err) {
                    response.status(400).json({ error: err.message });
                    return;
                  }
                }
              );
              fileCount++;
              console.log(data)
            });

            response.json({
              message: `Successfully uploaded ${fileCount} files`,
              success : true
            });
          } else {
            response.json({
              message: `Record does not exist`,
              success : false
            });
          }
        }
      );
    } catch (error) {
      response.json({
        success: false,
        message: "Error uploading file",
      });
    }
  }
}

export default FileController.getInstance();
