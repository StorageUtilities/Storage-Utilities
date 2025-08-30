import {system, CommandPermissionLevel, world, CustomCommandStatus} from '@minecraft/server'

system.beforeEvents.startup.subscribe((init) => {
    const UtilityItemsCommand =
        {
            name: "stu:utilityitems",
            description: "Load utility items barrel.",
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
        break
        };
    }
return { message: "Loaded utility items", status: CustomCommandStatus.Success}
}