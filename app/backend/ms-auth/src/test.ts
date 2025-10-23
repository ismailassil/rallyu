import { appConfig } from "./config";
import { db } from "./database";
import UserRepository from "./repositories/UserRepository";

const repo = new UserRepository();


(async function main() {
	await db.connect(appConfig.db.dbPath);

	// await repo.create(
	// 	'sss',
	// 	null,
	// 	'nabilos.fb@gmail.com',
	// 	'firstname',
	// 	'lastname'
	// );

	await repo.update(1337, {
		username: 'xezzuz'
	});

})();
