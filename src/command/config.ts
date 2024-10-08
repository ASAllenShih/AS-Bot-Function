enum CooldownType {
    Global = 'global',
};
interface Cooldown {
    [cooldownType: string]: number;
};
enum CommandType {
    All = 'all',
    Info = 'info',
    Fun = 'fun',
    Manage = 'manage',
    Bot = 'bot',
    Music = 'music',
};
interface CommandConfigJSON {
    cooldown: Cooldown;
    type: CommandType;
    ownerOnly: boolean;
};
class CommandConfig {
    private cooldown: Cooldown;
    private type: CommandType;
    private ownerOnly: boolean;
    public constructor() {
        this.cooldown = {};
        this.type = CommandType.All;
        this.ownerOnly = false;
    }
    public setCooldown(time: number, type: CooldownType): this {
        this.cooldown[type] = time;
        return this;
    }
    public setType(type: CommandType): this {
        this.type = type;
        return this;
    }
    public setOwnerOnly(ownerOnly: boolean): this {
        this.ownerOnly = ownerOnly;
        return this;
    }
    public toJSON(): CommandConfigJSON {
        return {
            cooldown: this.cooldown,
            type: this.type,
            ownerOnly: this.ownerOnly,
        };
    }
}
export {
    CooldownType,
    CommandType,
    CommandConfig,
};