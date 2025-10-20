import { FastifyReply, FastifyRequest } from "fastify";
import { UAParser } from "ua-parser-js";

export async function requestFingerprintHook(request: FastifyRequest, reply: FastifyReply) {
	const userAgentParser = new UAParser(request.headers['user-agent'] || '');

	const device = userAgentParser.getDevice();
	const browser = userAgentParser.getBrowser();
	const os = userAgentParser.getOS();

	request.fingerprint = {
		device: device.type?.toString() || 'Desktop',
		browser: `${browser.name?.toString() || 'Unknown Browser'} on ${os.name?.toString() || 'Unknown OS'}`,
		ip_address: request.ip
	}

	request.server.log.debug({ fingerprint: request.fingerprint }, '[HOOK] requestFingerprintHook');
}
