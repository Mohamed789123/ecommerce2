const globalErrorHandling = (err, req, res, next) => {
    res.json({ msg: "error", err: err.message, stack: err.stack })
    next()
}
export default globalErrorHandling