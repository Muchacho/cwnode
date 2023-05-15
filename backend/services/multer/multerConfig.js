const multer  = require("multer");

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "static");
    },
    filename: (req, file, cb) =>{
        cb(null, `${performance.now()}_${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
  
    if(file.mimetype === "image/png" || 
    file.mimetype === "image/jpg"|| 
    file.mimetype === "image/jpeg"){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}

module.export = {
    storageConfig, fileFilter
}