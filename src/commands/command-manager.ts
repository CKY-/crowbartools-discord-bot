import { Message } from 'discord.js';
import ICommandType from './ICommandType';
import IUserCommand from './IUserCommand';

interface CommandCheck {
    userCommand: IUserCommand;
    commandType: ICommandType;
}

const registeredCommandTypes: ICommandType[] = [];

export function registerCommand(commandType: ICommandType): void {
    if (commandType == null) return;

    const commandTypeExists = registeredCommandTypes.some(
        c => c.trigger.toLowerCase() === commandType.trigger.toLowerCase()
    );

    if (!commandTypeExists) {
        registeredCommandTypes.push(commandType);
    }
}

export function unregisterCommand(commandTrigger: string): void {
    const index = registeredCommandTypes.findIndex(c => c.trigger === commandTrigger);
    if (index > -1) {
        registeredCommandTypes.splice(index, 1);
    }
}

function checkForCommand(rawMessage: string): CommandCheck {
    if (rawMessage == null || rawMessage.length < 1) {
        return null;
    }

    // trim whitespace, then split message by space
    const tokens = rawMessage.trim().split(' ');

    // get first token to test as a command trigger
    const trigger = tokens[0];

    const commandType = registeredCommandTypes.find(
        ct => (ct.ignoreCase && trigger.toLowerCase() === ct.trigger.toLowerCase()) || trigger === ct.trigger
    );

    if (commandType != null) {
        return {
            commandType,
            userCommand: {
                trigger,
                args: tokens.splice(1),
            },
        };
    }

    return null;
}

export function handleMessage(message: Message): void {
    const commandCheck = checkForCommand(message.content);

    if (commandCheck) {
        const command = commandCheck.commandType;

        command.execute(message, commandCheck.userCommand);

        if (command.deleteTrigger && message.deletable) {
            message.delete(0);
        }
    }
}
