import { Crypto } from '@peculiar/webcrypto';
import '@testing-library/jest-dom';

global.crypto = new Crypto();
