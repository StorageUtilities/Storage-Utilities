import {system, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server'

system.beforeEvents.startup.subscribe((init) => {
    const MultiSummonCommand =
        {
            name: "stu:multisummon",
            description: "Placeholder",
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [{ type: CustomCommandParamType.EntityType, name: "entity" }, { type: CustomCommandParamType.Integer, name: "amount" }, {type: CustomCommandParamType.Location, name: "location"}],
        };
        init.customCommandRegistry.registerCommand(MultiSummonCommand, MultiSummonCommandCallback)
})
function MultiSummonCommandCallback(CustomCommandOrigin, entity, amount, location) {
amount = Math.max(0, Math.min(amount, 1000))
amount = amount || 1

switch (CustomCommandOrigin.sourceType) {
    case "Block": {
        for (let i = 0; i < amount; i++) {
            system.run(() => {CustomCommandOrigin.sourceBlock.dimension.spawnEntity(entity, location)}) 
        }
        break
    }
    case "Entity": {
        for (let i = 0; i < amount; i++) {
            system.run(() => {CustomCommandOrigin.sourceEntity.dimension.spawnEntity(entity, location)}) 
        }
        CustomCommandOrigin.sourceEntity.sendMessage(`§aSummoned ${amount.toString()} ${JSON.stringify(entity)}`)
        break
    }
}
}
