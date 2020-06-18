const db = require("../../config/db")

module.exports = {
    async create(data) {
        const query = `INSERT INTO chefs (name, file_id) VALUES ($1, $2) RETURNING id`
        const values = [data.name, data.file_id]
        const result = await db.query(query, values)
        return result.rows[0].id
    },
    async getAll() {
        const query = `SELECT * FROM chefs`
        const result = await db.query(query)
        return result.rows
    },
    async getOne(id) {
        const query = `SELECT * FROM chefs WHERE id = $1`
        const values = [id]
        const result = await db.query(query, values)
        return result.rows[0]
    },
    async update(data) {
        const query = `UPDATE chefs SET name=($2), file_id=($3) WHERE id = $1`
        const values = [data.id, data.name, data.file_id]
        return await db.query(query, values)
    },
    async delete(id) {
        const query = `DELETE FROM chefs WHERE id = $1`
        const values = [id]
        return await db.query(query, values)
    }
}