import Fastify from 'fastify';
import dbConnector from './plugin/database.plugin.js';
import natsPlugin from './plugin/nats.plugin.js';
import dotenv from '@dotenvx/dotenvx';


dotenv.config();

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  },
});

await fastify.register(dbConnector);
await fastify.register(natsPlugin, {
  NATS_URL: process.env.NATS_URL,
  NATS_USER: process.env.NATS_USER,
  NATS_PASSWORD: process.env.NATS_PASSWORD,
});

fastify.get('/chat/history', async (req, res) => {
  const { senderId, receiverId, limit = 30, offset = 0 } = req.query;
  try {
    const statement = fastify.db.prepare(
      `SELECT * FROM message
      WHERE ((senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?))
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?`
    );
    
    const result = statement.all(senderId, receiverId, receiverId, senderId, limit, offset);
    
    res.send(result.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send({ error: 'Failed to retrieve messages' });
  }
});

fastify.get('/chat/friend_list', async (req, res) => {
  const userId = Number(req.headers['x-user-id']);
  
  if (!userId) {
    return res.status(400).send({ error: 'Missing or invalid user ID' });
  }

  try {
    const friendsResponse = await fastify.nats.request(
      "user.friends",
      fastify.jc.encode({ user_id: userId }));
    
    const friendsOfUserId = fastify.jc.decode(friendsResponse.data).friends;

    if (!friendsOfUserId || friendsOfUserId.length === 0) {
      return res.send([]);
    }

    const getLastMessage = fastify.db.prepare(`
      SELECT * FROM message
      WHERE (senderId = ? AND receiverId = ?)
         OR (senderId = ? AND receiverId = ?)
      ORDER BY created_at DESC
      LIMIT 1
    `);
    const friendsWithMessages = friendsOfUserId.map(friend => {
      const lastMessage = getLastMessage.get(userId, friend.id, friend.id, userId);
      return lastMessage ? {...friend, last_message : lastMessage} : null;
    }).filter(Boolean)

    friendsWithMessages.sort((a, b) => {
      if (a.last_message && b.last_message) {
        return new Date(b.last_message.created_at) - new Date(a.last_message.created_at);
      }
      if (a.last_message) return -1;
      if (b.last_message) return 1;
      return 0;
    });
    res.send(friendsWithMessages);

  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).send({ error: 'Failed to retrieve friends' });
  }
});


fastify.listen({ port: 5015, host: '::' }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
