import * as mc from '@minecraft/server'
import {Command} from 'lib/canopy/CanopyExtension';
import  extension from 'config'
const UtilityItemsCommand = new Command({
    name: 'utilityitems',
    description: { text : 'Load utility items barrel.'},
    usage: 'utilityitems',
    callback: UtilityItemsCommandCallback,
    args: [
    ],
    contingentRules: ['StorageUtilities', 'creativeOnly'],
    adminOnly: false,
    helpEntries: [],
    helpHidden: false
});
extension.addCommand(UtilityItemsCommand);

function UtilityItemsCommandCallback(sender, args) {
    let {x, y, z} = sender.location
    mc.world.structureManager.place('mystructure:usefulitems', sender.dimension, {x: x ,y: y-1, z: z})
    sender.sendMessage('§aLoaded utility items')
}