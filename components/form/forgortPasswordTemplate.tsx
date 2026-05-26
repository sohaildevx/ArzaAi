import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface ForgotPasswordEmailProps {
  userEmail: string;
  resetPasswordUrl: string;
  brandName?: string;
}

export const ForgotPasswordEmail = ({
  userEmail,
  resetPasswordUrl,
  brandName = "ArzaAi",
}: ForgotPasswordEmailProps) => {
  return (
    <Html lang="en">
      <Preview>Reset your password for {brandName}</Preview>
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
        <Head />
        <Body className="bg-gray-50 my-auto mx-auto font-sans px-4">
          <Container className="border border-solid border-gray-200 rounded-xl my-10 mx-auto p-8 max-w-[465px] bg-white shadow-sm">
            
            
            <Section className="mt-4 text-center">
              <Text className="text-3xl font-extrabold tracking-tight my-0">
                <span className="text-gray-900">Arza</span>
                <span className="text-orange-500">AI</span>
              </Text>
            </Section>

            <Section className="mt-8 text-center">
              <Text className="text-gray-900 text-2xl font-semibold tracking-tight my-0">
                Reset your password
              </Text>
              
              <Text className="text-gray-700 text-[16px] leading-6 mt-6">
                Hello {userEmail},
              </Text>
              
              <Text className="text-gray-600 text-[16px] leading-6 mt-4">
                We received a request to reset the password for your ArzaAI account. If you didn't make this request, you can safely ignore this email.
              </Text>

              <Section className="text-center mt-8 mb-8">
                <Button
                  className="bg-[#4f46e5] text-white text-[15px] font-semibold no-underline text-center rounded-lg shadow-sm"
                  style={{ padding: '12px 30px', display: 'inline-block' }}
                  href={resetPasswordUrl}
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-gray-500 text-sm leading-5 mt-4">
                This password reset link is valid for the next <span className="font-semibold text-gray-700">60 minutes</span>.
              </Text>
              
              <Hr className="border border-solid border-gray-200 my-8 w-full" />
              
              <Text className="text-gray-500 text-sm leading-5 mb-2 text-left">
                If the button above doesn't work, copy and paste this URL into your browser:
              </Text>
              <div className="bg-gray-50 rounded-md p-3 border border-gray-100 text-left">
                <Text className="text-[#4f46e5] text-sm break-all my-0">
                  <a href={resetPasswordUrl} className="text-[#4f46e5] no-underline hover:underline">
                    {resetPasswordUrl}
                  </a>
                </Text>
              </div>
            </Section>

            <Section className="mt-12 text-center text-gray-400 text-xs">
              <Text className="my-1">
                © {new Date().getFullYear()} ArzaAI. All rights reserved.
              </Text>
              <Text className="my-1">
                If you have any questions, please contact our support team.
              </Text>
            </Section>
            
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ForgotPasswordEmail;