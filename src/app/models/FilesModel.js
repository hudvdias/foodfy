const db = require("../../config/db")

module.exports = {
    async create(data) {
        const query = `INSERT INTO files (name, path) VALUES ($1, $2) RETURNING id`
        const values = [data.filename, data.path]
        const result = await db.query(query, values)
        return result.rows[0].id
    },
    async getOne(id) {
        const query = `SELECT * FROM files WHERE id = $1`
        const values = [id]
        const result = await db.query(query, values)
        return result.rows[0]
    },
    async delete(id) {
        const query = `DELETE FROM files WHERE id = $1`
        const values = [id]
        return await db.query(query, values)
    },
    async link(recipeId, fileId) {
        const query = `INSERT INTO recipe_files (recipe_id, file_id) VALUES ($1, $2)`
        const values = [recipeId, fileId]
        return await db.query(query, values)
    },
    async getLinks(id) {
        const query = `SELECT * FROM recipe_files WHERE recipe_id = $1`
        const values = [id]
        const result = await db.query(query, values)
        return result.rows
    },
    async unlink(id) {
        const query = `DELETE FROM recipe_files WHERE file_id = $1`
        const values = [id]
        return await db.query(query, values)
    }
}