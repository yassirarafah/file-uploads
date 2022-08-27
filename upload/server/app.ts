import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import fileController from './controllers/FileController'



const app = express()
const upload = multer()

app.use(cors())

app.use(express.static('uploads'))


app.get('/files', fileController.getAllImages)
app.post('/upload', upload.array('file'),fileController.uploadFile )

app.listen(5000, () => {
    console.log(`Listening on port: 5000`);
  });
  