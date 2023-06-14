import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/assets");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // cb(null, `${file.originalname}`);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    },
});

export const upload = multer({
    storage,
    fileFilter: function (req, file, callback) {
        const ext = path.extname(file.originalname);
        if (file.fieldname === "document") {
            if (ext.trim() !== ".pdf") {
                return callback(new Error("Only Pdf files are allowed"));
            }
        }
        if (file.fieldname === "attachment_img" || file.fieldname === "attachments") {
            if (ext.trim() !== ".jpg" && ext.trim() !== ".png" && ext.trim() !== ".gif" && ext.trim() !== ".jpeg" && ext.trim() !== ".pdf" && ext.trim() !== ".txt" && ext.trim() !== ".csv" && ext.trim() !== ".doc" && ext.trim() !== ".docx") {
                return callback(new Error("Only files and images are allowed"));
            }
        }
        if (file.fieldname === "profile_img" || file.fieldname === "img" || file.fieldname === "property_img") {
            if (ext.trim() !== ".jpg" && ext.trim() !== ".png" && ext.trim() !== ".gif" && ext.trim() !== ".jpeg") {
                return callback(new Error("Only images are allowed"));
            }
        }

        if (file.fieldname)
            callback(null, true);
    },
});