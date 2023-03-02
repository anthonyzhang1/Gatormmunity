const multer = require("multer");
const uuid = require("uuid");

const storage = multer.diskStorage({
    destination: function (_, file, cb) {
        // Change the destination of the file depending on what file is being uploaded
        if (file.fieldname === "sfsu_id_picture") {
            cb(null, "private/sfsu_id_pictures");
        } else if (file.fieldname === 'profilePicture') {
            cb(null, "public/profile_pictures");   
        } else {
            console.log("Unrecognized fieldname in multer's destination.");
        }
    },

    // give the user's uploaded files a random filename before storing it on the server's file system
    filename: function (_, file, cb) {
        const fileExtension = file.mimetype.split("/")[1]; // get the file's file extension
        cb(null, `${uuid.v4()}.${fileExtension}`); // give the file a random name and its old extension
    },
});

module.exports = multer({ storage: storage });