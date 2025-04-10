import express from 'express';
import multer from 'multer';

const app = express();
//const upload = multer({ dest: 'uploads/' });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(undefined, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const uniqueFilename = `${uniquePrefix}__${file.originalname}`;

        cb(undefined, uniqueFilename);
    }
});

function fileFilter(req, file, cb){
    const validTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];

    if (!validTypes.includes(file.mimetype)) {
        cb(new Error("File type not allowed" + file.mimetype), false);
    } 
    else 
    {
        cb(null, true);
    }
}

const upload = multer({ 
    storage,
    limits:{
        fileSize: 1024 * 1024 * 20 // 20MB
    }, 
    fileFilter
});

app.use(express.urlencoded({ extended: true }));

app.post("/form", (req, res) => {
    console.log(req.body);
    delete req.body.password;
    res.send(req.body)
});

app.post("/fileform", upload.single('file'), (req, res) => {
    console.log(req.body);
    res.send();
});

const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => console.log("Server is running on port", PORT));