import {system, CommandPermissionLevel, CustomCommandParamType, world} from '@minecraft/server'
system.beforeEvents.startup.subscribe((init) => {
    const ItemSetCommand =
        {
            name: "stu:itemset",
            description: "Placeholder",
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [{ type: CustomCommandParamType.Enum, name: "stu:itemsetname" }],
        };
        init.customCommandRegistry.registerEnum("stu:itemsetname", ["casual", "TMC", "split", "nonstackable", "bulk"])
        init.customCommandRegistry.registerCommand(ItemSetCommand, ItemSetCommandCallback)
})

function ItemSetCommandCallback(CustomCommandOrigin, itemsetname) {
const ItemSetArray = ['casual', 'TMC', 'split', 'nonstackable', 'bulk']
const IsValidItemSet = ItemSetArray.includes(itemsetname)
const ItemSetStructures = {
    casual:'mystructure:casual_IS',
    TMC:'mystructure:TMC_IS',
    split:'mystructure:split_IS',
    nonstackable:'mystructure:NSIS',
    bulk:'mystructure:Bulk_IS'
}
switch (true) {
    case CustomCommandOrigin.sourceType === "Block" && IsValidItemSet: {
        let {x, y, z} = CustomCommandOrigin.sourceBlock.location
        system.run(() => {world.structureManager.place(ItemSetStructures[itemsetname], CustomCommandOrigin.sourceBlock.dimension, {x: x + 1 ,y: y, z: z + 1})})
        break 
    };
    case CustomCommandOrigin.sourceType === "Block" && !IsValidItemSet: {
        break
    };
    case CustomCommandOrigin.sourceType === "Entity" && IsValidItemSet: {
        let { x, y, z } = CustomCommandOrigin.sourceEntity.location
        system.run(() => {world.structureManager.place(ItemSetStructures[itemsetname], CustomCommandOrigin.sourceEntity.dimension, {x: x + 1 ,y: y, z: z + 1})})
        CustomCommandOrigin.sourceEntity.sendMessage(`§aLoaded item set ${itemsetname}`) 
        break
    };
    case CustomCommandOrigin.sourceType === "Entity" && !IsValidItemSet: {
        CustomCommandOrigin.sourceEntity.sendMessage(`§c${itemsetname} is not an valid item set. Please try again`)
        break
    };  
        }
        }