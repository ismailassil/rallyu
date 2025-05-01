import { app as fastify } from '../../app.js';
class AuthRepository {
    async getPasswordByUsername(username) {
        const user = await fastify.database.get('SELECT id, password FROM users WHERE username = ?', username);
        if (!user)
            return undefined;
        return { id: user.id, password: user.password, role: user.role };
    }
    async getUserByUsername(username) {
        const user = await fastify.database.get('SELECT * FROM users WHERE username = ?', username);
        return user?.username;
    }
    async getUserById(id) {
        const user = await fastify.database.get('SELECT * FROM users WHERE id = ?', id);
        return user?.password;
    }
    async insertNewUser(userInfo, hashedPassword) {
        const { firstName, lastName, username, email } = userInfo;
        const user = await fastify.database.run('INSERT INTO users (firstName, lastName, username, email, password) VALUES (?, ?, ?, ?, ?)', firstName, lastName, username, email, hashedPassword);
        return user?.lastID;
    }
}
export default AuthRepository;
