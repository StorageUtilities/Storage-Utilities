import {Command} from 'lib/canopy/CanopyExtension';
import  extension from 'config'
const BetterSummonCommand = new Command({
    name: 'summon',
    description: 'Summons any amount (up to 1,000) of a specified entity',
    usage: 'summon [entity] [amount]',
    callback: BetterSummonCommandCallback,
    args: [
        { type: 'string', name: 'entity' },
        { type: 'number', name: 'amount' }
    ],
    contingentRules: ['StorageUtilities', 'creativeOnly'], 
    adminOnly: false, 
    helpEntries: [],
    helpHidden: false
});
extension.addCommand(BetterSummonCommand);

function BetterSummonCommandCallback(sender, args) {
let {entity, amount} = args;
amount = Math.max(0, Math.min(amount, 1000))
for (let i = 0; i < amount; i++) {
    sender.dimension.spawnEntity(`minecraft:${entity}`, sender.location)
}
sender.sendMessage(`§aSummoned ${amount.toString()} ${entity}s`)
}
