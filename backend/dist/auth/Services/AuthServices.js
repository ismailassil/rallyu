import AuthRepository from '../../auth/Repositories/AuthRepository.js';
import { app as fastify } from '../../app.js';
class AuthServices {
    authRepository = new AuthRepository();
    async verifyUser(username, password) {
        if (fastify.isEmpty(username, password))
            throw new Error('username and password are required.');
        const user = await this.authRepository.getPasswordByUsername(username);
        if (!user)
            throw new Error('Invalid credentials.');
        const isPasswordValid = await fastify.bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            throw new Error('Invalid credentials.');
        return {
            id: user.id,
            username: username,
            role: user.role,
        };
    }
    async registerUser(userInfo) {
        const { username, password } = userInfo;
        const isUserExist = await this.authRepository.getUserByUsername(username);
        if (isUserExist)
            throw new Error('Username already exists');
        if (!fastify.userChecker(username))
            throw new Error('Invalid username.');
        if (!fastify.pwdCheker(password))
            throw new Error('Invalid password.');
        const hashedPassword = await fastify.bcrypt.hash(password);
        const userId = await this.authRepository.insertNewUser(userInfo, hashedPassword);
        if (!userId)
            throw new Error('Unknow Error Occurred.');
        return {
            id: userId,
            username: username,
            role: 'user',
        };
    }
    async createToken(user) {
        return fastify.jwt.sign({ payload: user }, { expiresIn: '2d' });
    }
}
export default AuthServices;
