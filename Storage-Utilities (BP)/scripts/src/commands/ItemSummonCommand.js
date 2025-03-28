import * as mc from '@minecraft/server'
import { ItemStack, world } from '@minecraft/server'
import {Command} from 'lib/canopy/CanopyExtension';
import  extension from 'config'
const ItemSummonCommand = new Command({
    name: 'itemsummon',
    description: { text : 'A command to summon any items from nothing'},
    usage: 'itemsummon [item] [amount] [location]',
    callback: ItemSummonCommandCallback,
    args: [
      { type: 'string|number', name: 'item' },
      { type: 'number', name: 'amount' },
      { type: 'number', name: 'x' },
      { type: 'number', name: 'y' },
      { type: 'number', name: 'z' },
    ],
    contingentRules: ['StorageUtilities','creativeOnly'],
    adminOnly: false,
    helpEntries: [
    ],
    helpHidden: false
});
extension.addCommand(ItemSummonCommand);

function ItemSummonCommandCallback(sender, args){
    let { item, amount, x, y, z } = args;
    const location = {x: x+0.5, y: y, z:z+0.5}
    sender.dimension.spawnItem(new ItemStack(item, amount), location);
};

export { ItemSummonCommandCallback }