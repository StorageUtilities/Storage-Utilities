import {system, CommandPermissionLevel, world} from '@minecraft/server'

system.beforeEvents.startup.subscribe((init) => {
    const UtilityItemsCommand =
        {
            name: "stu:utilityitems",
            description: "Placeholder",
            permissionLevel: CommandPermissionLevel.Any
        };
        init.customCommandRegistry.registerCommand(UtilityItemsCommand, UtilityItemsCommandCallback)
})

function UtilityItemsCommandCallback(CustomCommandOrigin) {
    switch (CustomCommandOrigin.sourceType) {
        case "Block": {
            let {x, y, z} = CustomCommandOrigin.sourceBlock.location
            system.run(() => {world.structureManager.place('mystructure:usefulitems', CustomCommandOrigin.sourceBlock.dimension, {x: x ,y: y + 1, z: z})})
            break
        };
        case "Entity": {
            let {x, y, z} = CustomCommandOrigin.sourceEntity.location
            system.run(() => {world.structureManager.place('mystructure:usefulitems', CustomCommandOrigin.sourceEntity.dimension, {x: x ,y: y - 1, z: z})}) 
            CustomCommandOrigin.sourceEntity.sendMessage('§aLoaded utility items')
        break
        };
    }
}