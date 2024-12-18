const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');

const secretsFilePath = path.join(__dirname, '../../secrets.txt');

exports.generateSecret = async (req, res) => {
  try {
    const { login } = req.body;
    const secret = speakeasy.generateSecret({
      length: 20,
      name: `GUARDIAO: ${login}`
    });

    // Salve o segredo em um arquivo local
    const secretData = `${login}:${secret.base32}\n`;
    fs.appendFileSync(secretsFilePath, secretData);

    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) {
        console.error('Erro ao gerar QR code:', err);
        return res.status(500).json({ message: 'Erro ao gerar QR code' });
      }
      res.json({ secret: secret.base32, qrCode: data_url });
    });
  } catch (error) {
    console.error('Erro ao gerar segredo:', error);
    res.status(500).json({ message: 'Erro ao gerar segredo' });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const { token, login } = req.body;

    // Recupere o segredo do arquivo local
    const secrets = fs.readFileSync(secretsFilePath, 'utf-8').split('\n');
    const userSecret = secrets.find(line => line.startsWith(`${login}:`));
    if (!userSecret) {
      return res.status(400).json({ verified: false, message: '2FA não cadastrado' });
    }

    const secret = userSecret.split(':')[1];

    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token
    });

    res.json({ verified });
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    res.status(500).json({ message: 'Erro ao verificar token' });
  }
};