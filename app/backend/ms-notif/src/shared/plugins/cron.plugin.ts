import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { AsyncTask, CronJob, SimpleIntervalJob } from 'toad-scheduler';

const CronJobPlugin = fp(async (fastify: FastifyInstance) => {
	const dismissedTask = new AsyncTask('removeDismissedNotif', async () => {
		fastify.database.run(
			"DELETE FROM messages WHERE status = 'dismissed' AND julianday(CURRENT_TIMESTAMP) - julianday(updated_at) > 6",
			function (error) {
				if (error) {
					fastify.log.error(error);
					return;
				}
				if (this.changes) {
					fastify.log.info(
						`Dismissed Notifications - ${this.changes} Changes Affected`,
					);
				} else {
					fastify.log.info(
						'Dismissed Notifications - No Changes Affected',
					);
				}
			},
		);
		fastify.log.info('============ CRONJOB IS RUNNING');
	});

	const cronJob = new CronJob({ cronExpression: '00 08 * * *' }, dismissedTask);

	fastify.scheduler.addCronJob(cronJob);
});

export default CronJobPlugin;
