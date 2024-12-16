import React from "react";

const PrivacyPolicy = () => {
  const containerStyle = {
    width: '100%',
    padding: '12px 0',
    lg: {
      padding: '24px',
    },
    xl: {
      padding: '32px',
    },
  };

  const proseStyle = {
    maxWidth: 'none',
    color: '#374151',
    dark: {
      color: '#9CA3AF',
    },
  };

  const titleStyle = {
    fontSize: '1.5rem',
    lg: {
      fontSize: '2.5rem',
    },
    fontWeight: 'bold',
    textAlign: 'center',
  };

  const subtitleStyle = {
    color: '#6B7280',
    textAlign: 'center',
    darkColor: '#9CA3AF',
  };

  const sectionTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
  };

  const paragraphStyle = {
    marginBottom: '1em',
  };

  return (
    <div style={containerStyle}>
      <div style={{ padding: '0 16px', md: { padding: '0 24px' } }}>
        <div style={proseStyle}>
          <h1 style={titleStyle}>Privacy Policy</h1>
          <p style={subtitleStyle}>
            Last updated: January 1, 2023
            <br />
            Please read this privacy policy carefully as it will help you make informed decisions about sharing your
            personal information with us.
          </p>
          <h2 style={sectionTitleStyle}>Introduction</h2>
          <p style={paragraphStyle}>
            At Example Inc., we are committed to protecting your privacy and ensuring the security of your personal
            information. This privacy policy describes how we collect, use, and share your personal information when you
            visit our website example.com (the "Site").
          </p>
          <p style={paragraphStyle}>
            By using the Site, you agree to the terms and conditions of this privacy policy. If you do not agree with
            the terms of this privacy policy, please do not use the Site.
          </p>
          <h2 style={sectionTitleStyle}>Information Collection</h2>
          <p style={paragraphStyle}>
            We may collect personal information from you when you interact with the Site. This information may include
            your name, email address, postal address, phone number, and other contact information. We may also collect
            information about your use of the Site, such as the pages you visit, the links you click, and the searches
            you conduct.
          </p>
          <h2 style={sectionTitleStyle}>Use of Information</h2>
          <p style={paragraphStyle}>
            We may use the information we collect from you to improve the Site, personalize your experience, and
            communicate with you. We may also use your information to send you marketing communications and promotional
            offers.
          </p>
          <h2 style={sectionTitleStyle}>Data Security</h2>
          <p style={paragraphStyle}>
            We take the security of your personal information seriously and have implemented technical and
            organizational measures to protect your data from unauthorized access, disclosure, and alteration.
          </p>
          <h2 style={sectionTitleStyle}>Third-Party Disclosure</h2>
          <p style={paragraphStyle}>
            We do not sell, trade, or otherwise transfer your personal information to third parties without your
            consent. However, we may share your information with trusted service providers who assist us in operating
            the Site or conducting our business.
          </p>
          <h2 style={sectionTitleStyle}>User Rights</h2>
          <p style={paragraphStyle}>
            You have the right to access, update, and delete your personal information. If you would like to exercise
            your rights, please contact us using the information provided in the "Contact Us" section below.
          </p>
          <h2 style={sectionTitleStyle}>Cookies</h2>
          <p style={paragraphStyle}>
            The Site uses cookies to enhance your experience and provide personalized content. By using the Site, you
            consent to the use of cookies in accordance with this privacy policy.
          </p>
          <h2 style={sectionTitleStyle}>Changes to the Privacy Policy</h2>
          <p style={paragraphStyle}>
            We may update this privacy policy from time to time to reflect changes in our practices or for other
            operational, legal, or regulatory reasons. We will notify you of any material changes to this privacy policy
            by posting the updated policy on the Site.
          </p>
          <h2 style={sectionTitleStyle}>Contact Information</h2>
          <p style={paragraphStyle}>
            If you have any questions about this privacy policy or our privacy practices, please contact us at
            privacy@example.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
