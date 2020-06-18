const db = require("../../config/db")

module.exports = {
    async create(data) {
        const query = `INSERT INTO recipes (user_id, chef_id, title, ingredients, preparation, information) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`
        const values = [data.user_id, data.chef_id, data.title, data.ingredients, data.preparation, data.information]
        const result = await db.query(query, values)
        return result.rows[0].id
    },
    async getAll() {
        const query = `SELECT * FROM recipes ORDER BY "created_at" DESC`
        const result = await db.query(query)
        return result.rows
    },
    async getOne(id) {
        const query = `SELECT * FROM recipes WHERE id = $1`
        const values = [id]
        const result = await db.query(query, values)
        return result.rows[0]
    },
    async update(data) {
        const query = `UPDATE recipes SET chef_id=($2), title=($3), ingredients=($4), preparation=($5), information=($6) WHERE id = $1`
        const values = [data.id, data.chef_id, data.title, data.ingredients, data.preparation, data.information]
        return await db.query(query, values)
    },
    async delete(id) {
        const query = `DELETE FROM recipes WHERE id = $1`
        const values = [id]
        return await db.query(query, values)
    },
    async getbyChef(id) {
        const query = `SELECT * FROM recipes WHERE chef_id = $1 ORDER BY "created_at" DESC`
        const values = [id]
        const result = await db.query(query, values)
        return result.rows
    },
    async getbyName(search) {
        const query = `SELECT * FROM recipes WHERE recipes.title ILIKE '%${search}%' ORDER BY "updated_at" DESC`
        const result = await db.query(query)
        return result.rows
    },
    async getByUser(id) {
        const query = `SELECT * FROM recipes WHERE user_id = $1 ORDER BY "created_at" DESC`
        const values = [id]
        const result = await db.query(query, values)
        return result.rows
    }
}