import Image from "next/image";

export const LocalUserPlusIcon = '/icons/user-plus.svg';
export const LocalUserMinusIcon = '/icons/user-minus.svg';
export const LocalUserXIcon = '/icons/user-x.svg';
export const LocalUserPencilIcon = '/icons/user-pencil.svg';
export const LocalChatIcon = '/icons/chat.svg';

export default function LocalIcon({ src, alt, height, width } : { src: string, alt: string, height: number, width: number }) {
	return <Image alt={alt} src={src} height={height} width={width} draggable={false} />;
}
