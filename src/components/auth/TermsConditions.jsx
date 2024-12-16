import React from "react";

const TermsConditions = () => {
  return (
    <div className="w-full py-12 lg:py-24 xl:py-32">
    <div className="container px-4 md:px-6">
      <div className="prose prose-gray max-w-none dark:prose-invert">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Terms and Conditions</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Last updated: March 7, 2024
          <br />
          Please read these terms and conditions carefully before using our website.
        </p>
        <h2 className="text-2xl font-semibold">Introduction</h2>
        <p>
          Welcome to Example Inc. By accessing and using this website, you accept and agree to be bound by the terms
          and conditions outlined below.
        </p>
        <p>If you do not agree with any of these terms, please do not use our website.</p>
        <h2 className="text-2xl font-semibold">Use of Website</h2>
        <p>The use of this website is subject to the following terms of use:</p>
        <ul>
          <li>
            You agree to use this website only for lawful purposes and in a way that does not infringe the rights of,
            restrict, or inhibit anyone else's use and enjoyment of the website.
          </li>
          <li>You agree not to use the website for any fraudulent or harmful activities.</li>
          <li>Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense.</li>
        </ul>
        <h2 className="text-2xl font-semibold">Changes to Terms</h2>
        <p>
          Example Inc. reserves the right to make changes to these terms and conditions at any time. Your continued
          use of the website after any changes indicates your acceptance of the modified terms.
        </p>
        <h2 className="text-2xl font-semibold">Contact Information</h2>
        <p>If you have any questions about these terms and conditions, please contact us at terms@example.com.</p>
      </div>
    </div>
  </div>
  );
};

export default TermsConditions;
