/* This file contains multer's configuration settings. multer is used to handle images sent from the front end,
 * and saves the images into our file system. */

const multer = require("multer");
const uuid = require("uuid");

/** Contains multer's configuration for storing files on our file system. */
const storage = multer.diskStorage({
    /* Changes the destination of the file depending on what file is being uploaded. */
    destination: function (_, file, cb) {
        switch (file.fieldname) {
            case 'groupPicture': // group pictures
                cb(null, "public/group_pictures");
                break;
            case 'itemPhoto': // listing photos
                cb(null, "public/listing_photos");
                break;
            case 'profilePicture': // profile pictures
                cb(null, "public/profile_pictures");
                break;
            case 'sfsuIdPicture': // SFSU ID card pictures
                cb(null, "private/sfsu_id_pictures");
                break;
            case 'threadImage': // forum thread pictures
                cb(null, "public/thread_images");
                break;
            default:
                console.log("Unrecognized fieldname provided for multer's destination.");
        }
    },

    /* Gives the user's uploaded files a random filename. */
    filename: function (_, file, cb) {
        const fileExtension = file.mimetype.split("/")[1]; // get the file's file extension

        cb(null, `${uuid.v4()}.${fileExtension}`); // give the file a random name and its old file extension
    }
});

module.exports = multer({ storage: storage });