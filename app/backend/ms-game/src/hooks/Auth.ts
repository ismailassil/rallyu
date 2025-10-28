import dotenv from 'dotenv'
import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken'
dotenv.config();

const MS_MATCHMAKING_API_KEY = process.env.MS_MATCHMAKING_API_KEY || 'DEFAULT_MS_MATCHMAKING_SECRET_';
const MS_NOTIF_API_KEY = process.env.MS_NOTIF_API_KEY || 'DEFAULT_MS_MATCHMAKING_SECRET_';
const JWT_ACCESS_SECRET = process.env['JWT_ACCESS_SECRET'] || ''

export const AuthHandler = async (req: FastifyRequest, res: FastifyReply) => {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader) {
        token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7)
            : authHeader;
    }
    else if (req.query && (req.query as any).accessToken) {
        token = (req.query as any).accessToken;
    }

    if (!token) {
        return res.code(401).send({ message: 'Unauthorized' });
    }
    
    if (token !== MS_MATCHMAKING_API_KEY && token !== MS_NOTIF_API_KEY) {
        try {
            const decoded = jwt.verify(token, JWT_ACCESS_SECRET, { algorithms: ['HS256'] });
            // req.headers['rallyu-userid'] = decoded.sub.toString();
        } catch (err) {
            return res.code(401).send({ message: 'Unauthorized' });
        }
    }
}
