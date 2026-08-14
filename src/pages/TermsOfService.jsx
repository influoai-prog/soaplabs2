import { LegalPage } from '../components/LegalPage'

const sections = [
  {
    id: 'acceptance-of-terms',
    heading: 'Acceptance of terms',
    body: [
      'These Terms of Service (\u201cTerms\u201d) govern your use of the Soap Labs website. By accessing or using this website, you agree to be bound by these Terms. If you do not agree with any part of them, please do not use the website.',
    ],
  },
  {
    id: 'use-of-the-website',
    heading: 'Use of the website',
    body: [
      'You agree to use this website for lawful purposes only and in a way that does not infringe the rights of, or restrict or inhibit the use of the website by, anyone else.',
      'You must not:',
      {
        list: [
          'Copy, reproduce, resell, or misuse the content of this website for commercial purposes without permission.',
          'Attempt to gain unauthorised access to the website, its servers, or any systems connected to it.',
          'Use the website in a way that could damage, disable, or impair the website or interfere with anyone else\u2019s use of it.',
          'Use the website to transmit any harmful code, spam, or unlawful material.',
        ],
      },
    ],
  },
  {
    id: 'intellectual-property',
    heading: 'Intellectual property',
    body: [
      'The content on this website, including text, graphics, logos, and design, belongs to Soap Labs or its licensors and is protected by intellectual property laws. You may view and print content for personal, non-commercial use, but you may not use it for any other purpose without our written permission.',
    ],
  },
  {
    id: 'services-and-engagement',
    heading: 'Services and engagement',
    body: [
      'This website describes the services Soap Labs offers. It is for information only and does not, on its own, create a contractual relationship.',
      'Work delivered by Soap Labs is carried out under a written agreement agreed with each client before any engagement begins. In the event of any conflict, the terms of that written agreement take precedence over anything described on this website.',
    ],
  },
  {
    id: 'client-obligations',
    heading: 'Client obligations',
    body: [
      'Where you engage Soap Labs to do work, you agree to provide accurate information, access, and support reasonably needed to complete the engagement, and to make decisions and provide feedback in a timely manner.',
    ],
  },
  {
    id: 'fees-and-payment',
    heading: 'Fees and payment',
    body: [
      'Fees for services are set out in the written agreement for each engagement. Unless otherwise agreed, fees are due according to the payment terms in that agreement. Soap Labs is not responsible for delays caused by late or incomplete payment.',
    ],
  },
  {
    id: 'confidentiality',
    heading: 'Confidentiality',
    body: [
      'Soap Labs treats the information shared by clients during an engagement as confidential and uses it only to deliver the agreed work. This duty continues after the engagement ends, except where disclosure is required by law or the information is already public.',
    ],
  },
  {
    id: 'liability-and-disclaimers',
    heading: 'Liability and disclaimers',
    body: [
      'This website is provided \u201cas is\u201d and without warranties of any kind, express or implied. We work to keep the information on the site accurate and up to date, but we make no guarantees that it is complete, error-free, or suitable for your particular circumstances.',
      'To the fullest extent permitted by law, Soap Labs will not be liable for any indirect or consequential loss arising from your use of this website. Nothing in these Terms limits or excludes liability that cannot be limited or excluded by law.',
    ],
  },
  {
    id: 'third-party-services',
    heading: 'Third-party services',
    body: [
      'This website may refer to or link to third-party products and services. Soap Labs is not responsible for the availability, content, or performance of third-party services, and any use you make of them is at your own risk.',
    ],
  },
  {
    id: 'termination',
    heading: 'Termination',
    body: [
      'We may restrict or suspend access to this website, or any part of it, at any time without notice if we reasonably believe these Terms have been breached. Provisions of these Terms that are intended to survive termination will continue to apply.',
    ],
  },
  {
    id: 'changes-to-terms',
    heading: 'Changes to these terms',
    body: [
      'We may update these Terms from time to time. When we do, we will change the \u201cLast updated\u201d date above. Your continued use of the website after changes are made means you accept the updated Terms.',
    ],
  },
  {
    id: 'governing-law',
    heading: 'Governing law',
    body: [
      'These Terms are governed by and interpreted in accordance with the laws of the jurisdiction in which Soap Labs operates. Any disputes relating to these Terms or your use of this website will be subject to the exclusive jurisdiction of the courts of that jurisdiction.',
    ],
  },
]

function TermsOfService() {
  return (
    <LegalPage
      documentTitle="Terms of Service | Soap Labs"
      eyebrow="Legal"
      title="Terms of Service"
      updated="Last updated: August 2026"
      sections={sections}
      contact={
        <p>
          Questions about these terms? Email us at <a href="mailto:hello@soaplabs.co">hello@soaplabs.co</a>.
        </p>
      }
    />
  )
}

export default TermsOfService
