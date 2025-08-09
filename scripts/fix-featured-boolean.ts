import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({ log: ['query', 'error', 'warn'] })

async function run() {
  try {
    console.log('Starting fix: normalize Content.featured to Boolean via raw MongoDB commands...')

    // Convert 'featured' exact string 'true' to boolean true
    const r1 = await prisma.$runCommandRaw({
      update: 'Content',
      updates: [
        {
          q: { featured: 'true' },
          u: [
            {
              $set: { featured: true },
            },
          ],
          multi: true,
          upsert: false,
        },
      ],
    })

    // Convert 'featured' exact string 'false' to boolean false
    const r2 = await prisma.$runCommandRaw({
      update: 'Content',
      updates: [
        {
          q: { featured: 'false' },
          u: [
            {
              $set: { featured: false },
            },
          ],
          multi: true,
          upsert: false,
        },
      ],
    })

    // Optional: handle 'featured' '1'/'0' strings or numbers
    const r3 = await prisma.$runCommandRaw({
      update: 'Content',
      updates: [
        {
          q: { featured: { $in: ['1', 1] } },
          u: [
            {
              $set: { featured: true },
            },
          ],
          multi: true,
          upsert: false,
        },
      ],
    })

    const r4 = await prisma.$runCommandRaw({
      update: 'Content',
      updates: [
        {
          q: { featured: { $in: ['0', 0] } },
          u: [
            {
              $set: { featured: false },
            },
          ],
          multi: true,
          upsert: false,
        },
      ],
    })

    // Now normalize 'published' similarly
    const r5 = await prisma.$runCommandRaw({
      update: 'Content',
      updates: [
        {
          q: { published: 'true' },
          u: [
            {
              $set: { published: true },
            },
          ],
          multi: true,
          upsert: false,
        },
      ],
    })

    const r6 = await prisma.$runCommandRaw({
      update: 'Content',
      updates: [
        {
          q: { published: 'false' },
          u: [
            {
              $set: { published: false },
            },
          ],
          multi: true,
          upsert: false,
        },
      ],
    })

    const r7 = await prisma.$runCommandRaw({
      update: 'Content',
      updates: [
        {
          q: { published: { $in: ['1', 1] } },
          u: [
            {
              $set: { published: true },
            },
          ],
          multi: true,
          upsert: false,
        },
      ],
    })

    const r8 = await prisma.$runCommandRaw({
      update: 'Content',
      updates: [
        {
          q: { published: { $in: ['0', 0] } },
          u: [
            {
              $set: { published: false },
            },
          ],
          multi: true,
          upsert: false,
        },
      ],
    })

    console.log('Fix complete.', { r1, r2, r3, r4, r5, r6, r7, r8 })
  } catch (error) {
    console.error('Fix script failed:', error)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

run()


