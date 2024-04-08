import { test } from '@jest/globals';
import { DockerConnector } from './dockerConnector';
import Dockerode from 'dockerode';
import { getInfo, getPublicIp } from './hostConnector';

test("call /info api from docker id", async () => {
    const id = "c16dcf1cb418"
    const dc = new DockerConnector(new Dockerode())
    const c = await dc.getContainerInfo(id)
    const info = await getInfo(c.NetworkSettings.IPAddress)
})

test("list containers", async () => {
    const d = new Dockerode()
    let c = await d.listContainers({ all: true, filters: { name: { "^/saseul-node-50": true } } })
    console.log(c)
})

test("get public ip", async () => {
    await getPublicIp()
    // console.log(ip)
}, 20000)