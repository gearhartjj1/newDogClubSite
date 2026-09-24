import { useState } from 'react';
import infoStyles from './InfoPage.module.css';
import styles from './GettingStarted.module.css';

interface GuideStep {
  text: string;
  image?: string;
  imageAlt?: string;
}

interface Guide {
  id: string;
  title: string;
  description: string;
  steps: GuideStep[];
}

// Add guides here. Place screenshots in public/gettingStarted/ and reference
// them like image: '/gettingStarted/create-account-1.png'
const guides: Guide[] = [
  {
    id: 'placeholder',
    title: 'Signing Into Your Account',
    description: 'Learn how to sign into your account quickly and securely.',
    steps: [
      {
        text: 'Click the "Sign In" button',
        image: '/gettingStartedGuides/signingIntoAccount/findingSignInButton.png',
        imageAlt: 'Screenshot description',
      },
      {
        text: 'Sign in using your username and password. This should be the same credentials from the classic site',
        image: '/gettingStartedGuides/signingIntoAccount/signInModal.png',
        imageAlt: 'Screenshot description',
      }
    ],
  },
  {
    id: 'placeholder',
    title: 'Using the profile page',
    description: 'Learn how to use and manage your profile page effectively.',
    steps: [
      {
        text: 'You can add your dogs to your profile, this can be used during enrollment',
        image: '/gettingStartedGuides/usingProfilePage/addingDogs.png',
        imageAlt: 'Screenshot showing how to navigate to the profile page',
      },
      {
        text: 'Past classes can be seen here. Clicking "view details" will open a more detailed view and allow you to pay for a class with PayPal',
        image: '/gettingStartedGuides/usingProfilePage/classHistory.png',
        imageAlt: 'Screenshot showing how to edit profile information',
      }
    ],
  },
  {
    id: 'placeholder',
    title: 'Signing up for classes',
    description: 'Learn how to sign up for classes quickly and securely.',
    steps: [
      {
        text: 'Navigate to the classes section from the main menu. If you are signed in your user data will be preloaded.',
        image: '/gettingStartedGuides/signingUpForClasses/findingClassesPage.png',
        imageAlt: 'Screenshot showing how to navigate to the classes section',
      },
      {
        text: 'Select the class you want to sign up for and follow the prompts to complete your registration. You can use your dogs stored to your profile.',
        image: '/gettingStartedGuides/signingUpForClasses/usingStoredDogs.png',
        imageAlt: 'Screenshot showing how to select and sign up for a class',
      },
      {
        text: 'Finish the class sign-up process by choosing payment method and confirming waivers. If you are a member, check the member box. If your account is marked as a member, this will auto-select',
        image: '/gettingStartedGuides/signingUpForClasses/finishClassSignup.png',
        imageAlt: 'Screenshot showing how to select and sign up for a class',
      }
    ],
  },
];

function GuideSection({ guide }: { guide: Guide }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.guide}>
      <button
        className={styles.guideHeader}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div className={styles.guideHeaderText}>
          <h2>{guide.title}</h2>
          <p>{guide.description}</p>
        </div>
        <span className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}>▼</span>
      </button>
      {isExpanded && (
        <ol className={styles.stepList}>
          {guide.steps.map((step, index) => (
            <li key={index} className={styles.step}>
              <p className={styles.stepText}>{step.text}</p>
              {step.image && (
                <img
                  src={step.image}
                  alt={step.imageAlt || `Step ${index + 1} screenshot`}
                  className={styles.stepImage}
                />
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default function GettingStarted() {
  return (
    <div className={infoStyles.container}>
      <section className={infoStyles.hero}>
        <h1>🚀 Getting Started</h1>
        <p>Step-by-step guides on how to use the site</p>
      </section>

      <section className={styles.guides}>
        {guides.map((guide) => (
          <GuideSection key={guide.id} guide={guide} />
        ))}
      </section>
    </div>
  );
}
