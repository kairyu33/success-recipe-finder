#!/usr/bin/env node

/**
 * Quick setup script for note-hashtag-ai-generator
 *
 * This script helps users set up the project quickly by:
 * 1. Checking if .env.local exists
 * 2. Creating it from .env.example if it doesn't
 * 3. Prompting for the API key
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envLocalPath = path.join(__dirname, '.env.local');
const envExamplePath = path.join(__dirname, '.env.example');

console.log('\n🚀 note.com ハッシュタグ AI ジェネレーター - セットアップ\n');

// Check if .env.local already exists
if (fs.existsSync(envLocalPath)) {
  console.log('✅ .env.local ファイルは既に存在します。');
  console.log('📝 必要に応じて手動で編集してください。\n');
  rl.close();
  process.exit(0);
}

// Read .env.example
if (!fs.existsSync(envExamplePath)) {
  console.error('❌ .env.example ファイルが見つかりません。');
  rl.close();
  process.exit(1);
}

console.log('📋 .env.local ファイルを作成します...\n');

rl.question('Anthropic APIキーを入力してください (Enter でスキップ): ', (apiKey) => {
  let envContent = fs.readFileSync(envExamplePath, 'utf8');

  if (apiKey && apiKey.trim()) {
    envContent = envContent.replace('your_api_key_here', apiKey.trim());
    console.log('\n✅ APIキーを設定しました。');
  } else {
    console.log('\n⚠️  APIキーはスキップされました。');
    console.log('   後で .env.local ファイルを手動で編集してください。');
  }

  // Write .env.local
  fs.writeFileSync(envLocalPath, envContent);
  console.log('✅ .env.local ファイルを作成しました。\n');

  console.log('🎉 セットアップ完了！\n');
  console.log('次のステップ:');
  console.log('1. npm run dev - 開発サーバーを起動');
  console.log('2. http://localhost:3000 をブラウザで開く\n');

  if (!apiKey || !apiKey.trim()) {
    console.log('⚠️  重要: APIキーを .env.local に追加することを忘れずに！');
    console.log('   取得先: https://console.anthropic.com/settings/keys\n');
  }

  rl.close();
});
