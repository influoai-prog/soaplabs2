import { LegalPage } from '../components/layout/legal-page'

const sections = [
  {
    id: 'who-we-are',
    heading: 'Who we are',
    body: [
      'Soap Labs is a consulting practice that maps operations, finds where money is being wasted, and builds the fix. We operate this website to explain what we do and how people can get in touch.',
      'This policy explains what information we collect when you use our website, why we collect it, and how it is handled. It applies to everyone who visits this website, whether or not they become a client.',
    ],
  },
  {
    id: 'information-we-collect',
    heading: 'Information we collect',
    body: [
      'We only collect the information needed to run the business and to respond to requests. The information we may collect falls into two groups:',
      {
        list: [
          'Information you provide directly, such as your name, email address, company, and anything you include when you message us or book a call.',
          'Information collected automatically, such as anonymised usage data (for example the pages you visit) so we can understand how the site is used and keep it working reliably.',
        ],
      },
    ],
  },
  {
    id: 'how-we-use-information',
    heading: 'How we use your information',
    body: [
      'We use the information we hold only for the purposes it was shared for, including:',
      {
        list: [
          'Responding to enquiries and messages you send us.',
          'Arranging and carrying out calls or meetings you book.',
          'Preparing proposals and carrying out work we are engaged to do.',
          'Improving this website and the way we describe and deliver our services.',
        ],
      },
    ],
  },
  {
    id: 'sharing-and-disclosure',
    heading: 'Sharing and disclosure',
    body: [
      'We do not sell personal data, and we do not share it for advertising purposes. We only share information where it is necessary to deliver our services, such as with the tools and providers we use to operate, or where we are required to do so by law.',
      'Where we do work with providers, we keep the data we share to the minimum required and make sure the provider handles it responsibly.',
    ],
  },
  {
    id: 'cookies-and-analytics',
    heading: 'Cookies and analytics',
    body: [
      'This website uses cookies and similar technologies to keep the site working and to collect anonymised analytics about how it is used. You can disable cookies in your browser at any time, though some parts of the site may not work as well without them.',
    ],
  },
  {
    id: 'data-retention',
    heading: 'How long we keep information',
    body: [
      'We keep personal information only for as long as it is needed for the purpose it was collected, or for as long as the law requires. When information is no longer needed, we delete it securely.',
    ],
  },
  {
    id: 'your-rights',
    heading: 'Your rights',
    body: [
      'You can ask us at any time to see what information we hold about you, to correct it, to delete it, or to limit how it is used. Where we rely on your consent, you can withdraw it at any time. We will respond to any request without delay and within the timeframes required by law.',
    ],
  },
  {
    id: 'data-security',
    heading: 'Security',
    body: [
      'We take reasonable technical and organisational measures to protect the information we hold against loss, misuse, and unauthorised access. No method of transmission over the internet is completely secure, and we cannot guarantee absolute security.',
    ],
  },
  {
    id: 'third-party-links',
    heading: 'Links to other sites',
    body: [
      'This website may link to third-party websites. We are not responsible for the privacy practices or the content of those sites, and we recommend you read their policies before sharing any information with them.',
    ],
  },
  {
    id: 'changes-to-this-policy',
    heading: 'Changes to this policy',
    body: [
      'We may update this policy from time to time. When we do, we will change the \u201cLast updated\u201d date above. Where changes are significant, we will draw your attention to them on this website.',
    ],
  },
]

function PrivacyPolicy() {
  return (
    <LegalPage
      documentTitle="Privacy Policy | Soap Labs"
      eyebrow="Legal"
      title="Privacy Policy"
      updated="Last updated: August 2026"
      sections={sections}
      contact={
        <p>
          Questions about this policy? Email us at <a href="mailto:hello@soaplabs.co">hello@soaplabs.co</a>.
        </p>
      }
    />
  )
}

export default PrivacyPolicy
