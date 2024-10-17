const multer = require('multer')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const MIME_TYPE = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
}

const storage = multer.memoryStorage()

const upload = multer({
	storage: storage
}).single('image')

const resizeImage = (req, res, next) => {
	if (!req.file) {
		return next()
	}

	const filename = req.file.originalname.split(' ').join('_')
	const filenameArray = filename.split('.')
	filenameArray.pop()

	const filenameWithoutExtention = filenameArray.join('.')

	if (!MIME_TYPE[req.file.mimetype]) {
		return next(new Error('Invalid file type'))
	}

	const extension = MIME_TYPE[req.file.mimetype]
	const newFilename = filenameWithoutExtention + Date.now() + '.' + extension
	const outputPath = path.join('./images', newFilename)

	sharp(req.file.buffer)
		.resize(250, 250)
		.toFile(outputPath, (err, info) => {
			if (err) {
				return next(err)
			}
			req.file.path = outputPath
			req.file.filename = newFilename
			next()
		})
}

module.exports = {
	upload,
	resizeImage
}