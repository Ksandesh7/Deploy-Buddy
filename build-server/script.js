const {exec} = require('child_process')
const path = require('path')
const fs = require('fs')
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3')
const mime = require('mime-types')
const Redis = require('ioredis')

const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: '',
        secretAccessKey: ''
    }
})

const publisher = new Redis('')

const PROJECT_ID = process.env.PROJECT_ID

function publishLogs(log) {
    publisher.publish(`logs:${PROJECT_ID}`, JSON.stringify({log}))
}

async function init() {
    console.log('Executing script.js')
    publishLogs(`Build Started`);
    const outDirPath = path.join(__dirname, 'output');

    const p = exec(`cd ${outDirPath} && npm install && npm run build`)

    p.stdout.on('data', function (data) {
        console.log(data.toString());
        publishLogs(`${data.toString}`);
    })

    p.stdout.on('error', function (data) {
        console.log("Error: ", data.toString());
        publishLogs(`Error: ${data.toString()}`);
    })

    p.on('close', async function() {
        console.log('Build Complete');
        publishLogs(`Build Complete`)
        publishLogs(`Starting to Upload`)
        
        let distFolderPath = path.join(__dirname, 'output', 'build')

        if (!fs.existsSync(distFolderPath)) {
            distFolderPath = path.join(__dirname, 'output', 'dist');
        }

        if (!fs.existsSync(distFolderPath)) {
            console.error('Neither build nor dist folder found');
            publishLogs(`Neither build not dist folder found`);
            process.exit(1);
        }

        const distFolderContents = fs.readdirSync(distFolderPath, {recursive: true})

        for(const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file);
            if(fs.lstatSync(filePath).isDirectory()) continue;

            console.log("Uploading...  ", filePath);
            publishLogs(`Uploading ${file}`)

            const command = new PutObjectCommand({
                Bucket:'deployment-pipeline-outputss',
                Key: `__outputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath) 
            })

            await s3Client.send(command);
            console.log("Uploaded... ", filePath);
            publishLogs(`Uploaded ${file}`)
        }
        console.log("Done...")
        publishLogs(`Done...`)
        process.exit(1);
    })
}

init();