import fp from 'fastify-plugin';
const checkersPlugin = fp(async function (fastify) {
    fastify.decorate('pwdCheker', function (password) {
        const minLength = 8;
        const hasNumber = /[0-9]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?:{}|<>]/.test(password);
        if (password.length < minLength ||
            !hasNumber ||
            !hasUpperCase ||
            !hasLowerCase ||
            !hasSpecial)
            return false;
        return true;
    });
    fastify.decorate('userChecker', function (username) {
        const minLength = 4;
        const maxLength = 20;
        const isLenght = username.length < minLength || username.length > maxLength;
        const isValid = /^[a-zA-Z0-9_]+$/.test(username);
        if (isLenght || !isValid)
            return false;
        return true;
    });
});
export default checkersPlugin;
