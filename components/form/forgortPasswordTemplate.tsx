import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface ForgotPasswordEmailProps {
  userEmail: string;
  resetPasswordUrl: string;
}

export const ForgotPasswordEmail = ({
  userEmail = 'user@example.com',
  resetPasswordUrl = 'https://example.com/reset',
}: ForgotPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your password for ArzaAi</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: '#4f46e5', 
              },
            },
          },
        }}
      >
        <Body className="bg-gray-50 my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-gray-200 rounded-lg my-[40px] mx-auto p-[20px] max-w-[465px] bg-white shadow-sm">
            

            <Section className="mt-[32px] text-center">
              <Text className="text-brand text-[24px] font-bold tracking-tight my-0">
                ArzaAi
              </Text>
            </Section>

           
            <Section className="mt-[32px]">
              <Text className="text-gray-800 text-[22px] font-semibold tracking-tight p-0 my-0">
                Reset your password
              </Text>
              
              <Text className="text-gray-600 text-[15px] leading-[24px] mt-[16px]">
                Hello {userEmail},
              </Text>
              
              <Text className="text-gray-600 text-[15px] leading-[24px]">
                We received a request to reset your password. If you didn't make this request, you can safely ignore this email.
              </Text>

              
              <Section className="text-center mt-[32px] mb-[32px]">
                <Button
                  className="bg-brand text-white text-[14px] font-medium no-underline text-center px-6 py-3 rounded-md shadow-md block"
                  href={resetPasswordUrl}
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-gray-500 text-[13px] leading-[20px]">
                This password reset link is only valid for the next 60 minutes.
              </Text>
              
              <Hr className="border border-solid border-gray-200 my-[26px]" />
              
              <Text className="text-gray-400 text-[12px] leading-[18px]">
                If the button above doesn't work, copy and paste this URL into your browser:
              </Text>
              <Text className="text-brand text-[12px] break-all mt-[4px]">
                {resetPasswordUrl}
              </Text>
            </Section>

            <Section className="mt-[32px] text-center text-gray-400 text-[12px]">
              <Text className="my-1">
                © {new Date().getFullYear()} YourBrand Inc. All rights reserved.
              </Text>
              <Text className="my-1">
                123 Innovation Way, San Francisco, CA 94107
              </Text>
            </Section>
            
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ForgotPasswordEmail;