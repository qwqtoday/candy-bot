import { Bot, BotOptions, Plugin as MineflayerPlugin } from "mineflayer";
import { Vec3 } from "vec3";

export interface AutoPlaceBlockPlugin {
    enabled: boolean
    
    blockToPlace: string
    placeBlockOn: string

    enable: () => void
    disable: () => void
}

declare module "mineflayer" {
    interface Bot {
        autoPlaceBlock: AutoPlaceBlockPlugin
    }
}

export default ((bot: Bot, options: BotOptions) => {
    if (bot.autoPlaceBlock !== undefined && bot.autoPlaceBlock !== null) 
        throw new Error("The auto place block plugin is being loaded multiple times")

    let place_block_timer: NodeJS.Timeout = null

    const enable = () => {
        if (bot.autoPlaceBlock.enabled) return;

        bot.autoPlaceBlock.enabled = true
        if (place_block_timer !== null) {
            clearInterval(place_block_timer)
        }

        // Place block logic here.
        place_block_timer = setInterval(() => {
            if (bot.autoPlaceBlock.placeBlockOn === null || bot.autoPlaceBlock.blockToPlace === null) {
                return;
            }
            
            const blockToPlaceItemType = bot.registry.itemsByName[bot.autoPlaceBlock.blockToPlace]
            if (blockToPlaceItemType === undefined) {
                return;
            }

            const placeBlockOnBlockType = bot.registry.blocksByName[bot.autoPlaceBlock.placeBlockOn]
            if (placeBlockOnBlockType === undefined) {
                return;
            }

            const placeBlockItem = bot.inventory.findInventoryItem(blockToPlaceItemType.id, null, false)
            if (placeBlockItem === null) {
                return;
            }

            const blocksToPlaceOn = bot.findBlocks({
                point: bot.entity.position,
                matching: (block) => block !== null && 
                                     block.type === placeBlockOnBlockType.id && 
                                     block.position.offset(0, 1, 0).xzDistanceTo(bot.entity.position) >= 1 &&
                                     (
                                        bot.blockAt(block.position.offset(0, 1, 0)) === null ||
                                        bot.blockAt(block.position.offset(0, 1, 0)).name === "air"
                                     ),
                maxDistance: 4,
                useExtraInfo: true,
            })

            if (blocksToPlaceOn.length === 0) {
                return;
            }

            try {
                const blockToPlaceOn = blocksToPlaceOn[Math.floor(Math.random()*blocksToPlaceOn.length)];
                bot.equip(placeBlockItem, "hand")
                    .then(() => {
                        bot.activateBlock(bot.blockAt(blockToPlaceOn), new Vec3(0, 1, 0))
                            .catch()
                    })
            } catch (err){
            }
            
        }, 200)
    }

    const disable = () => {
        if (!bot.autoPlaceBlock.enabled) return;
        bot.autoPlaceBlock.enabled = false
        if (place_block_timer !== null) {
            clearInterval(place_block_timer)
        }
    }

    bot.autoPlaceBlock = {
        enable,
        disable,
        blockToPlace: null,
        placeBlockOn: null,
        enabled: false
    }
}) satisfies MineflayerPlugin