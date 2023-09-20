
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as YAML from 'yaml';
import { spawn } from 'child_process';

export class EncryptedFile {
  private secretKey: Buffer;

  constructor(keyFilePath: string) {
    if (!fs.existsSync(keyFilePath)) {
      this.secretKey = crypto.randomBytes(32);
      fs.writeFileSync(keyFilePath, this.secretKey);
    } else
      this.secretKey = fs.readFileSync(keyFilePath);
  }

  private encrypt(data: string): string {
    // Generate a random IV for each encryption
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-gcm', this.secretKey, iv);
    const encrypted = cipher.update(data, 'utf8', 'base64') + cipher.final('base64');
    const authTag = cipher.getAuthTag().toString('base64');
    return iv.toString('base64') + ':' + encrypted + ':' + authTag;
  }

  private decrypt(encryptedText: string): string {
    const [ivBase64, encryptedData, authTag] = encryptedText.split(':');
    const iv = Buffer.from(ivBase64, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.secretKey, iv);
    decipher.setAuthTag(Buffer.from(authTag, 'base64'));
    const decrypted = decipher.update(encryptedData, 'base64', 'utf8') + decipher.final('utf8');
    return decrypted;
  }

  public read(filename: string): any {
    if (fs.existsSync(filename)) {
      const encryptedData = fs.readFileSync(filename, 'utf8');
      return this.decrypt(encryptedData);
    }
    return '';
  }

  public write(filename: string, data: any): void {
    try {
      const encryptedData = this.encrypt(data);
      fs.writeFileSync(filename, encryptedData, 'utf8');
      console.log('Data saved to encrypted file:', filename);
    } catch (err) {
      console.error('Error saving encrypted file:', err);
    }
  }
}

function editInSystemEditor(data: string, callback: (data: any | null) => void): void {
  // Create a temporary file
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, `temp-file-${crypto.randomBytes(32).toString('hex')}.yaml`);
  fs.writeFileSync(tempFilePath, data);

  const systemEditor = process.env.VISUAL || process.env.EDITOR || 'vi';

  // Open the temporary file in the text editor
  const editorProcess = spawn(systemEditor, [tempFilePath], { stdio: 'inherit' });

  editorProcess.on('exit', (code, _signal) => {
    if (code === 0) {
      const editedData = fs.readFileSync(tempFilePath, 'utf8');
      callback(editedData);
    }
    fs.unlinkSync(tempFilePath);
  });
}

export function edit(environment: string | undefined = undefined) {
  if (!fs.existsSync('config'))
    fs.mkdirSync('config');

  const env = environment ? `.${environment}` : '';
  const credentialsFilePath = `config/credentials${env}.yaml.enc`;
  const encryptor = new EncryptedFile(`config/master${env}.key`);
  const data = encryptor.read(credentialsFilePath);

  editInSystemEditor(data, (editedData: string | null) => {
    if (editedData !== null) {
      encryptor.write(credentialsFilePath, editedData);
    }
  });
}

export default function credentials(environment: string | undefined = undefined): any {
  const env = environment ? `.${environment}` : '';
  const encryptor = new EncryptedFile(`config/master${env}.key`);
  return YAML.parse(encryptor.read(`config/credentials${env}.yaml.enc`));
}
