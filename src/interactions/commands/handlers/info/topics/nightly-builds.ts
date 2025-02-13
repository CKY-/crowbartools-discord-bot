import { getBaseEmbed, InfoTopic } from '../info-helpers';

export const nightly: InfoTopic = {
    name: 'Nightly Builds',
    message: {
        embeds: [
            getBaseEmbed()
                .setTitle('Nightly Builds')
                .setDescription(
                    `You can find more information about the Nightly builds [here](https://discord.com/channels/372817064034959370/372821213443129346/973669737877889094).`
                ),
        ],
    },
};
