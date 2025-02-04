import * as mc from '@minecraft/server'
import {Command} from 'lib/sapling';
import  {extension} from 'config'

const ItemSetCommand = new Command()
    .setName('itemset')
    .setUsage('[name]')
    .addArgument('string', 'itemsetname')
    .setCallback((sender, {itemsetname}) => {
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
        })
    .setValidation({requiredGamerules: ["StorageUtilities", "creativeOnly"]})
    .build();

extension.setCommand(ItemSetCommand);