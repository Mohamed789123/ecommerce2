const asynchandler = (fn) => {
    return async (req, res, next) => {
        fn(req, res, next).catch((err) => {
            next(err)
        })
    }
}


export default asynchandler