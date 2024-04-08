
import cron from 'cron'; // or any other cron library you prefer
import { logger } from '../api/node/logger';
import { getOption } from "../api/option/optionProvider";
import { dockerConnector } from '../api/dockerConnector';

// Create a cron job instance
export const cronJob = new cron.CronJob('*/5 * * * *', async () => {
    // This function will be executed on the cron schedule
    const { auto } = getOption()
    if (!auto) {
        logger.info("cron: auto option disabled")
        return
    }
    const containers = await dockerConnector.getSaseulWithEnvs()
    const restartPromises = containers
        .filter(container => container.info.data?.status !== "is_running")
        .map(async container => {
            logger.info({ containerId: container.Id, msg: "cron: container is not running" })
            return await dockerConnector.exec(container.Id, "saseul-script restart")
        })
    const startMiningPromises = containers
        .filter(container => container.info.data?.status === "is_running" && !container.info?.data?.mining)
        .map(async container => {
            logger.info({ containerId: container.Id, msg: "cron: container is not mining" })
            return await dockerConnector.exec(container.Id, "saseul-script startMining")
        })
    const forceResyncPromises = containers
        .filter(container => {
            const main = container.info?.data?.last_block?.height
            const resource = container.info?.data?.last_resource_block?.height
            return main && resource && main - resource > 100
        })
        .map(async container => {
            logger.info({ containerId: container.Id, msg: "cron: container is not synced" })
            return await dockerConnector.exec(container.Id, "forceSync --peer main.saseul.net")
        })
    return await Promise.allSettled([...restartPromises, ...startMiningPromises, ...forceResyncPromises])
}, () => {
    logger.info("cron: cron job completed")
}, true, 'Asia/Seoul');
