import { ItemStack, system, CommandPermissionLevel, CustomCommandParamType } from '@minecraft/server'

system.beforeEvents.startup.subscribe((init) => {
    const ItemSummonCommand =
        {
            name: "stu:itemsummon",
            description: "A command to summon any item from nothing",
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [{ type: CustomCommandParamType.ItemType, name: "item" }, { type: CustomCommandParamType.Integer, name: "amount" }, { type: CustomCommandParamType.Location, name: "location" }],
        };
        init.customCommandRegistry.registerCommand(ItemSummonCommand, ItemSummonCommandCallback)
})

function ItemSummonCommandCallback(CustomCommandOrigin, item, amount, location){
    switch (CustomCommandOrigin.sourceType) {
      case "Block": {
        system.run(() => {CustomCommandOrigin.sourceBlock.dimension.spawnItem(new ItemStack(item, amount), location).clearVelocity()})
        break
      };
      case "Entity": {
        system.run(() => {CustomCommandOrigin.sourceEntity.dimension.spawnItem(new ItemStack(item, amount), location).clearVelocity()})
        break
      };
    }
};