import { useState, useCallback } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

/**
 * A hook that provides reCAPTCHA verification functionality
 * @returns An object containing verification function and state
 */
export function useRecaptcha() {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Verify reCAPTCHA
     * @returns A promise that resolves to a boolean indicating whether verification was successful
     */
    const verifyRecaptcha = useCallback(async (): Promise<boolean> => {
        if (!executeRecaptcha) {
            setError('reCAPTCHA has not been loaded');
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const token = await executeRecaptcha('login');

            // Send the token to the backend for verification
            const response = await fetch('/api/recaptcha/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (response.ok && data.verified) {
                setIsVerified(true);
                return true;
            } else {
                setError(data.message || 'reCAPTCHA verification failed');
                setIsVerified(false);
                return false;
            }
        } catch (error) {
            console.error('reCAPTCHA verification error:', error);
            setError('reCAPTCHA verification failed');
            setIsVerified(false);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [executeRecaptcha]);

    // Return verification function and state
    return {
        verifyRecaptcha,
        isVerified,
        isLoading,
        error
    };
}