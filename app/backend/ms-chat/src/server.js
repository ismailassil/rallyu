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
  const userId = Number(req.headers['x-user-id']);

  if (!userId) {
    return res.status(400).send({ error: 'Missing or invalid user ID' });
  }

  try {
    const statement = fastify.db.prepare(
      `SELECT * FROM message 
			 WHERE senderId = ? OR receiverId = ?
			 ORDER BY created_at ASC`
    );

    const result = statement.all(userId, userId);
    res.send(result);
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
      fastify.jc.encode({ user_id: userId }),
      { timeout: 3000 }
    );
    const friendsOfUserId = fastify.jc.decode(friendsResponse.data).friends;
    
    if (!friendsOfUserId || friendsOfUserId.length === 0) {
      return res.send([]);
    }

    const friendsWithMessages = await Promise.all(
      friendsOfUserId.map(async (friend) => {
        try {
          const result = await fastify.db.prepare(`
            SELECT * FROM message
            WHERE (senderId = ? AND receiverId = ?)
               OR (senderId = ? AND receiverId = ?)
            ORDER BY created_at DESC
            LIMIT 1
          `);
          const last_message = result.get(userId, friend.id, friend.id, userId);
          
          return {
            ...friend,
            last_message: last_message || null
          };
        } catch (error) {
          console.error(`Error fetching last message for friend ${friend.id}:`, error);
          return {
            ...friend,
            last_message: null 
          };
        }
      }) 
    );

    const friendsWithConversations = friendsWithMessages.filter(
      friend => friend.last_message !== null
    );

    if (!friendsWithConversations || friendsWithConversations.length === 0) {
      return res.send(friendsOfUserId)
    }

    friendsWithConversations.sort((a, b) => {
      return new Date(b.last_message.created_at) - new Date(a.last_message.created_at);
    });
    
    res.send(friendsWithConversations);
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
