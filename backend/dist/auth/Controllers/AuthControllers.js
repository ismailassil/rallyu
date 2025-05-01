import AuthServices from '../../auth/Services/AuthServices.js';
class AuthController {
    authService = new AuthServices();
    async login(req, res) {
        const { username, password } = req.body;
        try {
            const user = await this.authService.verifyUser(username, password);
            const token = await this.authService.createToken(user);
            return res
                .status(200)
                .send({ success: true, message: 'Login Successful', token });
        }
        catch (err) {
            return res.status(500).send({
                error: err?.message ||
                    'An Unknown error occurred during Authorization',
            });
        }
    }
    async register(req, res) {
        const userInfo = req.body;
        try {
            const user = await this.authService.registerUser(userInfo);
            const token = await this.authService.createToken(user);
            return res.status(201).send({
                success: true,
                message: 'Registation Successful',
                token,
            });
        }
        catch (err) {
            return res.status(500).send({
                error: err?.message ||
                    'An Unknow error occurred during Authorization',
            });
        }
    }
    async logout(req, res) {
        // Logic for user logout
    }
    async forgotPassword(req, res) {
        // Logic for password recovery
    }
    async resetPassword(req, res) {
        // Logic for resetting the password
    }
    async verifyEmail(req, res) {
        // Logic for email verification
    }
    async changePassword(req, res) {
        // Logic for changing the password
    }
}
export default AuthController;
