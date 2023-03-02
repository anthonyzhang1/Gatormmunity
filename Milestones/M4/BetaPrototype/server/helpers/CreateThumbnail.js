const sharp = require("sharp");

/**
 * Creates a thumbnail of the image provided, if it exists. The thumbnail will be size `width` x `height`.
 * If the image file does not exist, this function does nothing.
 * 
 * @param {File} imageFile The image file object itself, usually gotten by `req.file`. Can be null.
 * @param {string} imagePath The path to the image in its original size.
 * @param {string} thumbnailPath The path that the thumbnail will be created in.
 * @param {int} width The width of the thumbnail in pixels.
 * @param {int} height The height of the thumbnail in pixels.
 * @returns On success, a fulfilled promise. On error, a rejected promise.
 */
function createThumbnail(imageFile, imagePath, thumbnailPath, width, height) {
    if (imageFile) { // checks if the image exists first before operating on it
        return sharp(imagePath) // get the path of the image to make a thumbnail of
            .resize(width, height, { fit: 'inside' }) // resize image to (width, height) pixels
            .toFile(thumbnailPath) // save image thumbnail to `thumbnailPath`
            .catch(err => Promise.reject(err)); // throw an error on error
    } else { // do nothing if the image does not exist
        return Promise.resolve();
    }
}

module.exports = createThumbnail;