const multer = require("multer");
const uuid = require("uuid");

const storage = multer.diskStorage({
    // Change the destination of the file depending on what file is being uploaded
    destination: function (_, file, cb) {
        switch (file.fieldname) {
            case 'groupPicture':
                cb(null, "public/group_pictures");
                break;
            case 'itemPhoto':
                cb(null, "public/listing_photos");
                break;
            case 'profilePicture':
                cb(null, "public/profile_pictures");
                break;
            case 'sfsu_id_picture':
                cb(null, "private/sfsu_id_pictures");
                break;
            case 'threadImage':
                cb(null, "public/thread_images");
                break;
            default:
                console.log("Unrecognized fieldname in multer's destination.");
        }
    },

    // give the user's uploaded files a random filename before storing it on the server's file system
    filename: function (_, file, cb) {
        const fileExtension = file.mimetype.split("/")[1]; // get the file's file extension
        cb(null, `${uuid.v4()}.${fileExtension}`); // give the file a random name and its old extension
    }
});

module.exports = multer({ storage: storage });