import React, { ReactNode } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

interface RecaptchaProviderProps {
    children: ReactNode;
    reCaptchaKey?: string;
}

/**
 * A provider component for Google reCAPTCHA v3
 * Wrap your application or specific components with this provider to use reCAPTCHA
 */
export function RecaptchaProvider({ children, reCaptchaKey }: RecaptchaProviderProps) {
    // Use the provided key or the one from environment variables
    const siteKey = reCaptchaKey || import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Test key for development

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={siteKey}
            scriptProps={{
                async: true,
                defer: true,
                appendTo: 'head',
            }}
        >
            {children}
        </GoogleReCaptchaProvider>
    );
}