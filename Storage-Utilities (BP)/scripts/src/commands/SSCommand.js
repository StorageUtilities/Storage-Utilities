// import * as mc from '@minecraft/server'
import {Command} from 'lib/canopy/CanopyExtension';
import  extension from 'config'
const SSCommand = new Command({
    name: 'ss',
    description: { text : 'Tells you what items you need to make a specified SS for any given container.'},
    usage: 'ss [container] [value]',
    callback: SSCommandCallback,
    args: [
        { type: 'string|number', name: 'container' },
        { type: 'number', name: 'value' }
    ],
    contingentRules: ['StorageUtilities'],
    adminOnly: false,
    helpEntries: [
    ],
    helpHidden: false
});
extension.addCommand(SSCommand);

function SSCommandCallback(sender, args) {
    let { container, value} = args;
    const HopperSS = {
    1:'1 item',
    2:'23 items',
    3:'46 items',
    4:'nonstackable + 5 items',
    5:'nonstackable + 28 items',
    6:'nonstackable + 51 items',
    7:'2 nonstackables + 10 items',
    8:'2 nonstackables + 32 items',
    9:'2 nonstackables + 55 items',
    10:'3 nonstackables + 14 items',
    11:'3 nonstackables + 37 items',
    12:'3 nonstackables + 60 items',
    13:'4 nonstackables + 19 items',
    14:'4 nonstackables + 43 items',
    15:'5 nonstackables'  
    } 

    const LecternSS = {
1:'pages 1-2/30',
2:'pages 3-4/30',
3:'pages 5-6/30',
4:'pages 7-8/30',
5:'pages 9-10/30',
6:'pages 11-12/30',
7:'pages 13-14/30',
8:'pages 15-16/30',
9:'pages 17-18/30',
10:'pages 19-20/30',
11:'pages 21-22/30',
12:'pages 23-24/30',
13:'pages 25-26/30',
14:'pages 27-28/30',
15:'pages 29-30/30'
    }
    const ComposterSS = {
1:'1 pumpkin pie',
2:'2 pumpkin pies',
3:'3 pumpkin pies',
4:'4 pumpkin pies',
5:'5 pumpkin pies',
6:'6 pumpkin pies',
8:'8 pumpkin pies'
    }
    const CrafterSS = {
1:'1 slot',
2:'2 slots',
3:'3 slots',
4:'4 slots',
5:'5 slots',
6:'6 slots',
7:'7 slots',
8:'8 slots',
9:'9 slots'
    }
    const BarrelChestSS = {
1:'1 nonstackables',
2:'2 nonstackables',
3:'4 nonstackables',
4:'6 nonstackables',
5:'8 nonstackables',
6:'10 nonstackables',
7:'12 nonstackabless',
8:'14 nonstackables',
9:'16 nonstackables',
10:'18 nonstackables',
11:'20 nonstackables',
12:'22 nonstackables',
13:'24 nonstackables',
14:'26 nonstackables',
15:'27 nonstackables'
    }
    const PotSS = {
    1:'1 16 stackable',
    2:'2 16 stackables',
    3:'3 16 stackables',
    4:'4 16 stackables',
    5:'5 16 stackables',
    6:'6 16 stackables',
    7:'7 16 stackables',
    8:'8 16 stackables',
    9:'10 16 stackables',
    10:'11 16 stackables',
    11:'12 16 stackables',
    12:'13 16 stackables',
    13:'14 16 stackables',
    14:'15 16 stackables',
    15:'16 16 stackables'
    }
    const FurnaceSS = {
1:'1 item',
2:'14 items',
3:'28 items',
4:'42 items',
5:'64 items',
6:'64 + 5 items',
7:'64 + 19 items',
8:'64 + 32 items',
9:'64 + 46 items',
10:'64 + 64 items'
   }
    const SS = {
    hopper:HopperSS,
    lectern:LecternSS,
    composter:ComposterSS,
    crafter:CrafterSS,
    barrel:BarrelChestSS,
    chest:BarrelChestSS,
    pot:PotSS,
    furnace:FurnaceSS
}
const Containers = ['hopper', 'lectern', 'composter', 'crafter', 'barrel', 'chest', 'pot', 'furnace']
const ValidContainer = Containers.includes(container)
const MaxSS = {
    hopper:15,
    lectern:15,
    composter:8,
    crafter:9,
    barrel:15,
    chest:15,
    pot:15,
    furnace:10,
}

    if (container === 'composter' && value === 7) {
        sender.sendMessage('§cSS/container is not valid. Please try again')
        return
    } 

if (ValidContainer === true && value <= MaxSS[container]) {
    sender.sendMessage(`§aFor SS of ${value} in ${container} you need §l§2${SS[container][value]}`)
}
else sender.sendMessage('§cSS/container is not valid. Please try again')
}