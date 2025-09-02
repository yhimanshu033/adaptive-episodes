const crypto = require('crypto')
const key = crypto.randomBytes(32)

console.log('\n' + key.toString('base64') + '\n')
