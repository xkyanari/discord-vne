const { EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const buttonPages = require('./paginator');

const chaptersDirectory = path.join(__dirname, '../chapters');
const charactersPath = path.join(__dirname, '../assets/characters.json');
const settingsPath = path.join(__dirname, '../assets/settings.json');

async function startNovel(interaction) {
    const chapters = fs.readdirSync(chaptersDirectory);
    const variablesContent = fs.readFileSync(charactersPath, "utf-8");
    const variablesData = JSON.parse(variablesContent);
    const settingsContent = fs.readFileSync(settingsPath, "utf-8");
    const settingsData = JSON.parse(settingsContent);

    for (const chapter of chapters) {
        const chapterPath = path.join(chaptersDirectory, chapter);
        const chapterContent = fs.readFileSync(chapterPath, "utf-8");
        const chapterData = JSON.parse(chapterContent);

        if (chapterData.dialogues && chapterData.dialogues.length > 0) {
            const embeds = [];
            for (const dialogue of chapterData.dialogues) {
                const characterVariables = variablesData[dialogue.character];
                const settingVariables = settingsData[dialogue.setting];

                if (!characterVariables) {
                    console.log(`No variables found for character: ${dialogue.character}`);
                    continue;
                }

                let currentEmbed = new EmbedBuilder();
                if (dialogue.character === 'Narrator') {
                    currentEmbed.setColor(characterVariables.defaultColor);
                }
                else {
                    const expressionKey = dialogue.expression || characterVariables.defaultExpression;
                    const expressionVariables = characterVariables.expressions[expressionKey];
    
                    if (!expressionVariables) {
                        console.log(`No variables found for expression: ${expressionKey}`);
                        continue;
                    }

                    currentEmbed.setTitle(dialogue.character)
                    currentEmbed.setColor(characterVariables.defaultColor)
                    currentEmbed.setThumbnail(expressionVariables.image);
                }

                if (dialogue.dialogue) {
                    currentEmbed.setDescription(dialogue.dialogue);
                }

                if (dialogue.thoughts) {
                    currentEmbed.setDescription(`_${dialogue.thoughts}_`);
                }

                if (dialogue.setting) {
                    currentEmbed.setImage(settingVariables.image);
                }

                embeds.push(currentEmbed);
            }
            await buttonPages(interaction, embeds);
        }
    }
}

module.exports = { startNovel };