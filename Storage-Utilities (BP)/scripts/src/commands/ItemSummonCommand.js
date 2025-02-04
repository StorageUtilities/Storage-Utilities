import {Command} from 'lib/sapling';
import  {extension} from 'config'
import { ItemStack, world} from '@minecraft/server'

const ItemSummonCommand = new Command()
    .setName('itemsummon')
    .setUsage('[item] [amount] [location]')
    .addArgument('string', 'item')
    .addArgument('number', 'amount')
    .addArgument('number', 'x')
    .addArgument('number', 'y')
    .addArgument('number', 'z')
    .setCallback((sender, {item, amount, x, y, z}) => {
        const location = {x: x+0.5, y: y, z:z+0.5}
        sender.dimension.spawnItem(new ItemStack(item, amount), location);
    })
    .setValidation({requiredGamerules: ["StorageUtilities", "creativeOnly"]})
    .build()

extension.setCommand(ItemSummonCommand)