import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "react-email";
import * as React from "react";
import { CompanyInviteEmailProps } from "./types";

export const CompanyInviteEmail = ({
  invitedByUsername,
  invitedByEmail,
  companyName,
  inviteLink,
  inviteRole,
}: CompanyInviteEmailProps) => {
  const previewText = `Join ${companyName}'s Events Archive as an administrator.`;

  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#4F46E5", // Indigo-600
              darkText: "#1F2937", // Gray-800
              lightText: "#4B5563", // Gray-600
            },
          },
        },
      }}
    >
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
        <Body className="bg-gray-50 my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-gray-200 rounded-lg my-[40px] mx-auto p-[32px] max-w-[465px] bg-white shadow-sm">
            
            {/* Logo Section */}
            <Section className="mt-[16px] text-center">
              <Heading className="text-2xl font-bold tracking-tight text-brand m-0">
                {companyName} <span className="text-darkText font-normal">Events</span>
              </Heading>
            </Section>

            {/* Introduction */}
            <Section className="mt-[32px]">
              <Text className="text-darkText text-[16px] leading-[24px]">
                Hello there,
              </Text>
              <Text className="text-lightText text-[15px] leading-[24px]">
                <strong>{invitedByUsername}</strong> (<Link href={`mailto:${invitedByEmail}`} className="text-brand no-underline">{invitedByEmail}</Link>) has invited you to join the <strong>{companyName} Events Archive</strong> as a/an <span className="bg-indigo-50 text-brand px-2 py-0.5 rounded font-medium text-[14px]">{inviteRole}</span>.
              </Text>
            </Section>

            {/* Admin Capabilities Panel */}
            <Section className="bg-gray-50 rounded-lg p-[16px] my-[24px] border border-solid border-gray-100">
              <Text className="text-darkText font-semibold text-[14px] m-0 mb-[8px]">
                As a member of the {companyName} Events Archive, you will be able to:
              </Text>
              <ul className="text-lightText text-[14px] leading-[22px] m-0 pl-[20px]">
                <li>Upload and manage past event media (videos, photos).</li>
                <li>Edit event metadata, descriptions.</li>
                <li>Manage user access levels and view engagement analytics, depending on your role.</li>
              </ul>
            </Section>

            {/* Call to Action */}
            <Section className="text-center mt-[32px] mb-[24px]">
              <Button
                className="bg-brand text-white text-[14px] font-semibold no-underline text-center px-[24px] py-[12px] rounded-md shadow-sm hover:bg-indigo-700"
                href={inviteLink}
              >
                Accept Invitation
              </Button>
            </Section>

            {/* Security Notice */}
            <Text className="text-gray-400 text-[12px] leading-[18px] text-center px-[12px]">
              This invitation was intended for you. If you were not expecting this invite, you can safely ignore this email. This link will expire in 7 days.
            </Text>

            <Hr className="border border-solid border-gray-200 my-[24px]" />

            {/* Footer */}
            <Section className="text-center">
              <Text className="text-gray-400 text-[12px] m-0">
                © 2026 {companyName} Inc. All rights reserved.
              </Text>
              <Text className="text-gray-400 text-[12px] mt-[4px]">
                No. 7, 3rd Avenue, Gwarinpa, Abuja, and
                No. 4, Murtala Nyako Commercial Complex, Opposite Old Secretariat, Minna.
              </Text>
            </Section>

          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default CompanyInviteEmail;