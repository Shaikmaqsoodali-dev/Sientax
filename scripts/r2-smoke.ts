import { config } from 'dotenv'
config({ path: '.env.local' })

import { S3Client, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

async function main() {
  const endpoint = process.env.R2_ENDPOINT
  const bucket = process.env.R2_BUCKET
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY

  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
    throw new Error('Missing R2 env vars')
  }

  const client = new S3Client({
    region: 'auto',
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  })

  const key = `healthchecks/${Date.now()}-sientax.txt`
  const body = Buffer.from('sientax r2 ok')

  await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: 'text/plain' }))
  await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))

  console.log(JSON.stringify({ ok: true, bucket, endpointHost: new URL(endpoint).host, key }))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
