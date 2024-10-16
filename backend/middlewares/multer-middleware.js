const multer = require('multer')
const sharp = require('sharp')

const MIME_TYPE = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
}

const storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './images')
	},
	filename: (req, file, callback) => {
		const filename = file.originalname.split(' ').join('_')
		const filenameArray = filename.split('.')
		filenameArray.pop()

		const filenameWithoutExtention = filenameArray.join('.')
		const extension = MIME_TYPE[file.mimetype]

		callback(null, filenameWithoutExtention + Date.now() + '.' + extension)
	}
})


const processImage = (req, res, next) => {
	if (!req.file) {
		return next();
	}

	const outputPath = `./images/resized_${req.file.filename}`;
	sharp(req.file.path)
		.resize(250, 250)
		.toFile(outputPath, (err, info) => {
			if (err) {
				return next(err);
			}
		});

	req.file.path = outputPath;
	next();
};

module.exports = [
	multer({
		storage: storage
	}).single('image'),
	processImage
]