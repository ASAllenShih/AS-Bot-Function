import {
	Client,
	MessagePayload,
	MessageCreateOptions,
	PermissionFlagsBits,
	Message,
	Channel,
	Guild,
	GuildMember,
} from 'discord.js';
type MessageContent = string | MessagePayload | MessageCreateOptions;
import { ActionFeedback } from './feedback';
interface MessageActionFeedback extends ActionFeedback {
	discordMessage?: Message<boolean>;
};
class DiscordAction {
	public static async banMemberById(guild: Guild, memberId: string, reason?: string, deleteMessageSeconds?: number): Promise<ActionFeedback> {
		const member = guild.members.cache.get(memberId);
		if (!member) {
			return {
				success: false,
				message: '找不到成員',
			};
		}
		return await this.banMember(member, reason, deleteMessageSeconds);
	}
	public static async banMember(member: GuildMember, reason?: string, deleteMessageSeconds?: number): Promise<ActionFeedback> {
		if (!member.bannable) {
			return {
				success: false,
				message: '無法封鎖成員，請確認機器人是否有足夠權限及該成員權限是否已比機器人低。',
			};
		}
		await member.ban({ reason, deleteMessageSeconds });
		return {
			success: true,
		};
	}
	public static async kickMemberById(guild: Guild, memberId: string, reason?: string): Promise<ActionFeedback> {
		const member = guild.members.cache.get(memberId);
		if (!member) {
			return {
				success: false,
				message: '找不到成員',
			};
		}
		return await this.kickMember(member, reason);
	}
	public static async kickMember(member: GuildMember, reason?: string): Promise<ActionFeedback> {
		if (!member.kickable) {
			return {
				success: false,
				message: '無法踢出成員，請確認機器人是否有足夠權限及該成員權限是否已比機器人低。',
			};
		}
		await member.kick(reason);
		return {
			success: true,
		};
	}
	public static async sendMessage(clientOrGuild: Client | Guild, channelId: string, message: MessageContent): Promise<MessageActionFeedback> {
		const channel = clientOrGuild.channels.cache.get(channelId);
		if (!channel) {
			return {
				success: false,
				message: '找不到頻道',
			};
		}
		return await this.sendMessageChannel(channel, message);
	}
	public static async sendMessageChannel(channel: Channel, message: MessageContent): Promise<MessageActionFeedback> {
		if (!channel.isTextBased() && !channel.isVoiceBased()) {
			return {
				success: false,
				message: '頻道不是屬於可傳送訊息的頻道',
			};
		}
		else if (!channel.isSendable()) {
			return {
				success: false,
				message: '無法發送訊息到頻道',
			};
		}
		if (!channel.isDMBased() && channel.guild.members.me) {
			const botPermissions = channel.permissionsFor(channel.guild.members.me);
			const requiredPermissions = [PermissionFlagsBits.SendMessages];
			if (channel.isThread()) {
				requiredPermissions.push(PermissionFlagsBits.SendMessagesInThreads);
			}
			const missingPermissions = botPermissions.missing(requiredPermissions);
			if (missingPermissions.length > 0) {
				return {
					success: false,
					message: `機器人沒有以下權限：${missingPermissions.join(', ')}`,
				};
			}
		}
		const send = await channel.send(message);
		return {
			success: true,
			discordMessage: send,
		};
	}
}
export {
	DiscordAction,
};