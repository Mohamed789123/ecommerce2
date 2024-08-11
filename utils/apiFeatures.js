export class ApiFeatures {
    constructor(mongooseQuery, QueryString) {
        this.mongooseQuery = mongooseQuery;
        this.QueryString = QueryString;
    }


    pagination() {

        let page = this.QueryString.page * 1 || 1
        if (page < 1) {
            page = 1
        }

        let limit = 2
        let skip = (page - 1) * limit
        this.mongooseQuery.find().skip(skip).limit(limit)
        this.page = page
        return this
    }

    filter() {

        let cutQuery = ["page", "sort", "select", "search"]
        let filter = { ...this.QueryString }
        cutQuery.forEach(e => delete filter[e])
        filter = JSON.parse(JSON.stringify(filter).replace(/(gt|lt|gte|lte|eq)/, (match) => `$${match}`))
        this.mongooseQuery.find(filter)
        return this
    }

    sort() {

        if (this.QueryString.sort) {
            this.mongooseQuery.sort(this.QueryString.sort.replaceAll(",", " "))
        }
        return this
    }

    select() {

        if (this.QueryString.select) {
            this.mongooseQuery.select(this.QueryString.select.replaceAll(",", " "))
        }
        return this
    }

    search() {

        if (this.QueryString.search) {
            this.mongooseQuery.find({
                $or: [
                    { title: { $regex: this.QueryString.search, $options: "i" } },
                    { description: { $regex: this.QueryString.search, $options: "i" } },
                ]
            })
        }
        return this
    }

}