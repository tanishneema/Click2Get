class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    // search() {
    //     const keyword = this.queryStr.keyword ? {
    //         "$or": [{
    //             name: {
    //                 $regex: this.queryStr.keyword,
    //                 $options: "i",
    //             }
    //         }, {
    //             description: {
    //                 $regex: this.queryStr.keyword,
    //                 $options: "i",
    //             }
    //         }, {
    //             category: {
    //                 $regex: this.queryStr.keyword,
    //                 $options: "i",
    //             }
    //         }
    //         ]
    //     } : {};

    search() {
        const keyword = this.queryStr.keyword
            ? {
                name: {
                    $regex: this.queryStr.keyword,
                    $options: "i",
                },
            }
            : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };

        //Removing some fields for Category
        const removeField = ['keyword', 'page', 'limit'];
        removeField.forEach(key => delete queryCopy[key])

        //Price Filter
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);


        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resultPerPage) {
        const currPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports = ApiFeatures;