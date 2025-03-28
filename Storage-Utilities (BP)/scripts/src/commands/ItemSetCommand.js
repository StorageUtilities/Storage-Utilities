import * as mc from '@minecraft/server'
import {Command} from 'lib/canopy/CanopyExtension';
import  extension from 'config'
const ItemSetCommand = new Command({
    name: 'itemset',
    description: { text : 'Load structure file of a certain item set.'},
    usage: 'itemset [name]',
    callback: ItemSetCommandCallback,
    args: [
        { type: 'string|number', name: 'itemsetname' }
    ],
    contingentRules: ['StorageUtilities', 'creativeOnly'],
    adminOnly: false,
    helpEntries: [
     { usage: 'itemset casual', description: { text : 'Loads casual item set'} },
     { usage: 'itemset TMC', description: { text : 'Loads TMC item set'} },
     { usage: 'itemset split', description:  { text : 'Loads split item set'} },
     { usage: 'itemset nonstackable', description:  { text : 'Loads nonstackable item set'} },
     { usage: 'itemset bulk', description: { text : 'Loads bulk item set'} },
    ],
    helpHidden: false
});
extension.addCommand(ItemSetCommand);

function ItemSetCommandCallback(sender, args) {
    let { itemsetname } = args;
    let {x, y, z} = sender.location
const ItemSetArray = ['casual', 'TMC', 'split', 'nonstackable', 'bulk']
const IsValidItemSet = ItemSetArray.includes(itemsetname)
const ItemSetStructures = {
    casual:'mystructure:casual_IS',
    TMC:'mystructure:TMC_IS',
    split:'mystructure:split_IS',
    nonstackable:'mystructure:NSIS',
    bulk:'mystructure:Bulk_IS'
}
                if (IsValidItemSet === true) {
          mc.world.structureManager.place(ItemSetStructures[itemsetname], sender.dimension, {x: x+1 ,y: y, z: z+1} )
          sender.sendMessage(`§aLoaded item set ${itemsetname}`) 
        }
        else sender.sendMessage(`§c${itemsetname} is not an valid item set. Please try again`)
    }