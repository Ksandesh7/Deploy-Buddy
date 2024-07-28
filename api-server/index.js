const express = require("express");
const { generateSlug } = require("random-word-slugs");
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");
const { Server } = require('socket.io')
const Redis = require('ioredis')
const cors = require("cors")
const app = express();
const PORT = process.env.PORT || 9000;

const subscriber = new Redis('')


const io = new Server({cors: "*"})

io.listen(9001, ()=>console.log('Socket Server listening on 9001'))

io.on('connection', socket=>{
    socket.on('subscribe', channel=>{
        socket.join(channel)
        socket.emit('message', `Joined ${channel}`)
    })
})  


const ecsClient = new ECSClient({
    region: "ap-south-1",
    credentials: {
        accessKeyId: "",
        secretAccessKey: "",
    },
});

const config = {
    CLUSTER: "",
    TASK: "",
};

app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.post("/project", async (req, res) => {
    const { gitURL } = req.body;
    const projectSlug = generateSlug();

    const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefinition: config.TASK,
        launchType: "FARGATE",
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: "ENABLED",
                subnets: [
                    "subnet-0cfb93880acdf91e0",
                    "subnet-05c83782d90e695d1",
                    "subnet-0476e39ea6998a7e2",
                ],
                securityGroups: ["sg-0575ab44b0ab2cf9c"],
            },
        },
        overrides: {
            containerOverrides: [
                {
                    name: "builder-image",
                    environment: [
                        { name: "GIT_REPOSITORY_URL", value: gitURL },
                        { name: "PROJECT_ID", value: projectSlug },
                    ],
                },
            ],
        },
    });

    await ecsClient.send(command);

    return res.json({
        status: "queued",
        data: { projectSlug, url: `http://${projectSlug}.localhost:8000` },
    });
});

async function initRedisSubscribe() {
    console.log('Subscribed to logs...')
    subscriber.psubscribe('logs:*')
    subscriber.on('pmessage', (pattern, channel, message) => {
        io.to(channel).emit('message', message);
    })
}

initRedisSubscribe();

app.listen(PORT, () => console.log(`API server running on PORT - ${PORT}`));
