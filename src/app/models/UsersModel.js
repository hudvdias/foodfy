const db = require("../../config/db")

module.exports = {
    async create(data) {
        const query = `INSERT INTO users (name, email, password, is_admin) VALUES ($1, $2, $3, $4) RETURNING id`
        const values = [data.name, data.email, data.password, data.is_admin]
        const result = await db.query(query, values)
        return result.rows[0].id
    },
    async getAll() {
        const query = `SELECT * FROM users`
        const result = await db.query(query)
        return result.rows
    },
    async getOne(id) {
        const query = `SELECT * FROM users WHERE id = $1`
        const values = [id]
        const result = await db.query(query, values)
        return result.rows[0]
    },
    async update(data) {
        const query = `UPDATE users SET name=($2), email=($3), is_admin=($4) WHERE id = $1`
        const values = [data.id, data.name, data.email, data.is_admin]
        return await db.query(query, values)
    },
    async delete(id) {
        const query = `DELETE FROM users WHERE id = $1`
        const values = [id]
        return await db.query(query, values)
    },
    async getOneByEmail(email) {
        const query = `SELECT * FROM users WHERE email = $1`
        const values = [email]
        const result = await db.query(query, values)
        return result.rows[0]
    },
    async setToken(id, token, expire) {
        const query = `UPDATE users SET reset_token=($2), reset_token_expires=($3) WHERE id = $1`
        const values = [id, token, expire]
        return await db.query(query, values)
    },
    async updatePassword(id, password) {
        const query = `UPDATE users SET password=($2), reset_token=($3), reset_token_expires=($4) WHERE id = $1`
        const values = [id, password, "", ""]
        return await db.query(query, values)
    }
}