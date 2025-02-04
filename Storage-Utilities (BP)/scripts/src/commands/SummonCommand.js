import {Command} from 'lib/sapling';
import  {extension} from 'config'

const BetterSummonCommand = new Command()
    .setName('summon')
    .setUsage('[entity] [amount]')
    .addArgument('string', 'entity')
    .addArgument('number', 'amount')
    .setCallback((sender, {entity, amount}) => {
        amount = Math.max(0, Math.min(amount, 1000))
         for (let i = 0; i < amount; i++) {
            sender.dimension.spawnEntity(`minecraft:${entity}`, sender.location)
         }
         sender.sendMessage(`§aSummoned ${amount.toString()} ${entity}s`)
    })
    .setValidation({requiredGamerules: ["StorageUtilities", "creativeOnly"]})
    .build();

extension.setCommand(BetterSummonCommand)