

const methods = ["body", "query", "headers", "params", "file", "files"]


const validation = (Schema) => {
    return async (req, res, next) => {
        const arrayError = []
        methods.forEach((key) => {
            if (Schema[key]) {
                const { error } = Schema[key].validate(req[key], { abortEarly: false })
                if (error?.details) {
                    error.details.forEach((err) => {
                        arrayError.push(err.message)
                    })
                }
            }
        })
        if (arrayError.length) {
            return res.json({ message: "Validation error", errors: arrayError })
        }
        next()
    }
}
export default validation