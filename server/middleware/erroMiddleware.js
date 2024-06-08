const notFound = (req, res, next) => {
    const error = new Error('Not found  -' + req.originalUrl);
    res.status(404)
    next(error)
}

const errorHandler = (err, req, res, nect) => {
    const statuscode = res.stauscode = 200 ? 500 : res.statuscode;
    res.status(statuscode)
    res.json({
        message:err.message,
        stack:process.env.NOVE_ENV == 'production' ? null : err.stack
    })
}

module.exports = {
    notFound,
    errorHandler
}