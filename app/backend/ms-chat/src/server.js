import Fastify from 'fastify';
import dbConnector from './plugin/database.plugin.js';
import natsPlugin from './plugin/nats.plugin.js';
import dotenv from '@dotenvx/dotenvx';
import chalk from "chalk";


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
      fastify.jc.encode({ user_id: userId }),
      { timeout: 3000 }
    );
    const friendsOfUserId = fastify.jc.decode(friendsResponse.data).friends;

    console.log(chalk.red(`11111245============3\n${JSON.stringify(friendsOfUserId, null, 2)}\n==================`));

    if (!friendsOfUserId || friendsOfUserId.length === 0) {
      return res.send([]);
    }

// Get all friend IDs
const friendIds = friendsOfUserId.map(f => f.id);

if (friendIds.length === 0) {
  return [];
}

// Single query to get all last messages
const placeholders = friendIds.map(() => '?').join(',');

const lastMessages = fastify.db.prepare(`
  WITH ranked_messages AS (
    SELECT 
      *,
      CASE 
        WHEN senderId = ? THEN receiverId 
        ELSE senderId 
      END as friend_id,
      ROW_NUMBER() OVER (
        PARTITION BY 
          CASE 
            WHEN senderId = ? THEN receiverId 
            ELSE senderId 
          END
        ORDER BY created_at DESC
      ) as rn
    FROM message
    WHERE (senderId = ? AND receiverId IN (${placeholders}))
       OR (receiverId = ? AND senderId IN (${placeholders}))
  )
  SELECT * FROM ranked_messages WHERE rn = 1
`).all(userId, userId, userId, ...friendIds, userId, ...friendIds);

// Create a map for quick lookup
const messageMap = new Map(
  lastMessages.map(msg => [msg.friend_id, msg])
);

// Combine friends with their last messages
const friendsWithMessages = friendsOfUserId.map(friend => ({
  ...friend,
  last_message: messageMap.get(friend.id) || null
}));

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
