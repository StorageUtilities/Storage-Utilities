import * as mc from '@minecraft/server'
import {Command} from 'lib/sapling';
import  {extension} from 'config'

const UtilityItemsCommand = new Command()
    .setName('utilityitems')
    .setCallback((sender) => {
        let {x, y, z} = sender.location
        mc.world.structureManager.place('mystructure:usefulitems', sender.dimension, {x: x ,y: y-1, z: z})
        sender.sendMessage('§aLoaded utility items')
    })
    .setValidation({requiredGamerules: ["StorageUtilities", "creativeOnly"]})
    .build();

extension.setCommand(UtilityItemsCommand)