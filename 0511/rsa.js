const crypto = require('crypto');

const nickname = 'Toy';
const targetPrefix = '0000';

function runPow(prefix) {
  let nonce = 0;
  let hash = '';
  let content = '';

  while (true) {
    content = nickname + nonce;
    hash = crypto.createHash('sha256').update(content).digest('hex');
    if (hash.startsWith(prefix)) {
      return { nonce, content, hash };
    }
    nonce += 1;
  }
}

function generateRsaKeyPair() {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
}

function signHash(privateKeyPem, hashHex) {
  const sign = crypto.createSign('sha256');
  sign.update(hashHex);
  sign.end();
  return sign.sign(privateKeyPem, 'hex');
}

function verifySignature(publicKeyPem, hashHex, signatureHex) {
  const verify = crypto.createVerify('sha256');
  verify.update(hashHex);
  verify.end();
  return verify.verify(publicKeyPem, signatureHex, 'hex');
}

function main() {
  console.log('=== RSA 密钥对生成 ===');
  const { publicKey, privateKey } = generateRsaKeyPair();
  console.log('公钥 PEM:');
  console.log(publicKey);
  console.log('私钥 PEM:');
  console.log(privateKey);

  console.log(`\n=== 计算 PoW：昵称+nonce 的 SHA256 哈希前缀为 ${targetPrefix} ===`);
  const powResult = runPow(targetPrefix);
  console.log(`找到符合条件的内容: ${powResult.content}`);
  console.log(`nonce: ${powResult.nonce}`);
  console.log(`hash: ${powResult.hash}`);

  console.log('\n=== 私钥签名 ===');
  const signature = signHash(privateKey, powResult.hash);
  console.log(`签名(hex): ${signature}`);

  console.log('\n=== 公钥验签 ===');
  const valid = verifySignature(publicKey, powResult.hash, signature);
  console.log(`验证结果: ${valid ? '成功' : '失败'}`);
}

main();
