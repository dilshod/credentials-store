
import * as fs from 'fs';
import * as path from 'path';
import { expect } from 'chai';
import { describe, afterEach, it } from 'mocha';
import { EncryptedFile } from './index.js';

describe('EncryptedFile', () => {
  const keyFilePath = path.join(__dirname, 'test.key');
  const encryptedFilePath = path.join(__dirname, 'test.txt.enc');
  const decryptedFilePath = path.join(__dirname, 'test.txt');

  afterEach(() => {
    // Clean up test files after each test.
    if (fs.existsSync(keyFilePath)) {
      fs.unlinkSync(keyFilePath);
    }
    if (fs.existsSync(encryptedFilePath)) {
      fs.unlinkSync(encryptedFilePath);
    }
    if (fs.existsSync(decryptedFilePath)) {
      fs.unlinkSync(decryptedFilePath);
    }
  });

  it('should encrypt and decrypt data', () => {
    const data = 'This is a test message';

    // Create an instance of EncryptedFile.
    const encryptor = new EncryptedFile(keyFilePath);

    // Encrypt the data and write it to a file.
    encryptor.write(encryptedFilePath, data);

    // Read and decrypt the data from the file.
    const decryptedData = encryptor.read(encryptedFilePath);

    // Ensure the decrypted data matches the original data.
    expect(decryptedData).to.equal(data);
  });
});
