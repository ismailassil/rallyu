import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { AsyncTask, CronJob } from 'toad-scheduler';

const CronJobPlugin = fp(async (fastify: FastifyInstance) => {
	const dismissedTask = new AsyncTask('removeDismissedNotif', async () => {
		try {
			const stmt = fastify.database.prepare(
				"DELETE FROM messages WHERE status = 'dismissed' AND julianday(CURRENT_TIMESTAMP) - julianday(updated_at) > 6",
			);

			const info = stmt.run();

			if (info.changes) {
				fastify.log.info(
					`Dismissed Notifications - ${info.changes} Changes Affected`,
				);
			} else {
				fastify.log.info('Dismissed Notifications - No Changes Affected');
			}
		} catch (error) {
			fastify.log.error(error);
		}
		fastify.log.info('============ CRONJOB IS RUNNING');
	});

	const cronJob = new CronJob({ cronExpression: '00 08 * * *' }, dismissedTask);

	fastify.scheduler.addCronJob(cronJob);
});

export default CronJobPlugin;
