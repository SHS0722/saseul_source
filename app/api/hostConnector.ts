import fetch from 'node-fetch'

export type Info = {
    code: number
    msg?: string,
    data?: {
        status: string
        version: string
        mining?: boolean,
        last_block: {
            height: number
            s_timestamp: number
            previous_blockhash: string
            blockhash: string
            transaction_count: number
        }
        last_resource_block: {
            height: number
            blockhash: string
            previous_blockhash: string
            nonce: string
            timestamp: number
            difficulty: string
            main_height: number
            main_blockhash: string
            validator: string
            miner: string
            receipt_count: number
        }
    }
}
export async function getInfo(host: string): Promise<Info> {
    const res = await fetch(`http://${host}/info`)
    return await res.json()
}

const ipValidator = (ip: string) => {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)
}
export async function getPublicIp() {
    const res = await fetch('https://api64.ipify.org')
    const ip = await res.text()

    if (ipValidator(ip)) {
        return ip
    } else {
        return undefined
    }
}
