import { useState } from 'react';
import { useRecaptcha } from '@/hooks/use-recaptcha';
import { Button } from '@/components/ui/button';
import { LoaderCircle, CheckCircle2 } from 'lucide-react';

interface RecaptchaButtonProps {
    onVerify?: (verified: boolean) => void;
}

/**
 * A button component that triggers reCAPTCHA verification
 */
export function RecaptchaButton({ onVerify }: RecaptchaButtonProps) {
    const { verifyRecaptcha, isVerified, isLoading, error } = useRecaptcha();

    const handleClick = async () => {
        const result = await verifyRecaptcha();
        if (onVerify) {
            onVerify(result);
        }
    };

    return (
        <div>
            <Button 
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleClick}
                disabled={isLoading || isVerified}
            >
                {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                {isVerified && <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />}
                {isVerified ? 'Verified' : 'Verify I\'m not a robot'}
            </Button>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}