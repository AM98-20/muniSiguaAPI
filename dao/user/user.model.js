const { getDb } = require('../../config/mysqldb');
let db = null;

class Users {

    constructor() {
        //super('Users');
        getDb()
            .then((database) => {
                db = database;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    //Add new item
    async newItem(data) {
        db.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "INSERT INTO users (username, name, surename, email, password, idPost, state) VALUES (?)";
            var values = [data.username, data.name, data.surname, data.email, data.password, data.idPost, data.userState];
            const results = db.promise().query(sql, [values], function (err, result) {
                if (err) throw err;
                console.log(result);
            });
            return results;
        });
    }

    //Get one by id
    async findById(id) {
        const filter = {
            _id: new ObjectId(id)
        };
        const doc = await this.collection.findOne(filter);
        return doc;
    }

    //Get All
    async findAll() {
        const cursor = await this.collection.find({});
        const docs = await cursor.toArray();
        return docs;
    }

    //Get All documents
    async findAll() {
        const cursor = await this.collection.find({});
        const docs = await cursor.toArray();
        return docs;
    }

    //Get faceted
    /*async getFaceted(page, items, filter = {}) {
        const cursor = this.collection.find(filter);
        const totalItems = await cursor.count();
        cursor.skip((page -1) * items);
        cursor.limit(items);

        const docs = await cursor.toArray();
        return {
            totalItems,
            page,
            items,
            totalPages: (Math.ceil(totalItems/items)),
            docs
        };
    }*/

    //Update one
    async updateOne(id, changes) {
        const filter = { _id: new ObjectId(id) };
        const updateCmd = {
            '$set': {
                ...changes
            }
        };

        return await this.collection.updateOne(filter, updateCmd);
    }

    //Delete one
    async deleteOne(id) {
        const filter = { _id: new ObjectId(id) };
        return await this.collection.deleteOne(filter);
    }

    async findByUsername(username) {
        const filter = {
            username
        }

        return await this.collection.findOne(filter);
    }

    async findById(id) {
        const _id = new ObjectId(id)
        const filter = {
            _id
        };
        const doc = await this.collection.findOne(filter);
        delete doc?.password;
        return doc;
    }
}

module.exports = Users;