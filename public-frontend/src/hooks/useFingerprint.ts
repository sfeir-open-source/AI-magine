import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useEffect, useState } from 'react';

export const useFingerprint = () => {
  const [fingerprintHash, setFingerprintHash] = useState('');

  useEffect(() => {
    const setFingerprint = async () => {
      const fp = await FingerprintJS.load();

      const { visitorId } = await fp.get();

      setFingerprintHash(visitorId);
    };

    setFingerprint();
  }, []);

  return fingerprintHash
}