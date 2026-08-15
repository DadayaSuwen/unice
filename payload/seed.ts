import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function main() {
  const payload = await getPayload({ config })

  const email = 'admin@unicechemical.com'
  const exists = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })
  if (exists.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email,
        password: 'admin123456',
        role: 'admin',
        displayName: '系统管理员',
      },
    })
    console.log('✓ 创建管理员:', email)
  } else {
    console.log('管理员已存在，跳过:', email)
  }
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
