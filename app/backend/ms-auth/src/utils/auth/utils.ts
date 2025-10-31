import { randomInt } from "node:crypto";
const { v4: uuidv4 } = require('uuid');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

export async function generateTOTPSecrets() : Promise<{ secret_base32: string, secret_qrcode_url: string }> {
	const TOTPSecrets = speakeasy.generateSecret();

	const QRCodeURL = await generateQRCode(TOTPSecrets.otpauth_url);

	return { secret_base32: TOTPSecrets.base32, secret_qrcode_url: QRCodeURL };
}

export function generateOTP() {
	return String(randomInt(100000, 1000000));
}

export function generateUUID() {
	return uuidv4();
}

export function verifyTOTP(secret_base32: string, code: string) : boolean {
	if (!secret_base32 || !code)
		return false;

	return speakeasy.totp.verify({
		secret: secret_base32,
		encoding: 'base32',
		token: code
	});
}

export function verifyOTP(storedOTP: string, userOTP: string) : boolean {
	if (!storedOTP || !userOTP)
		return false;

	return storedOTP === userOTP;
}

export async function generateQRCode(otpauth_url: string) : Promise<string> {
	return await QRCode.toDataURL(otpauth_url);
}

export function nowPlusSeconds(seconds: number) : number {
	return nowInSeconds() + seconds;
}

export function nowInSeconds() {
	return Math.floor(Date.now() / 1000);
}

export function nowInMilliseconds() {
	return Date.now();
}
