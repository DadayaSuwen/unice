// 测试数据库连接的简单脚本
const { Client } = require('pg');
require('dotenv').config();

async function testDatabaseConnection() {
  console.log('正在测试数据库连接...');

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ 数据库连接成功!');

    // 测试查询数据库版本
    const versionResult = await client.query('SELECT version()');
    console.log('✅ 数据库版本:', versionResult.rows[0].version);

    // 测试查询一个简单的表
    try {
      const countResult = await client.query('SELECT COUNT(*) FROM pg_tables WHERE schemaname = \'public\'');
      console.log('✅ 数据库连接正常，存在表数量:', countResult.rows[0].count);
    } catch (err) {
      console.log('ℹ️  数据库可能为空，但连接正常');
    }

    await client.end();
    console.log('✅ 测试完成，连接已关闭');

  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    await client.end();
    process.exit(1);
  }
}

testDatabaseConnection().catch(console.error);