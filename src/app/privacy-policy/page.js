import React from 'react';

export const metadata = {
  title: 'Privacy Policy | Heng Makara',
  description: 'Privacy Policy for Heng Makara Services. Learn how we handle your data.',
};

const PrivacyPolicy = () => {
  return (
    <div className="container pt-120 pb-100">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="term-policy-content">
            <h1 className="mb-5">Privacy Policy</h1>
            
            <div className="policy-block mb-4">
              <h4>1. Introduction</h4>
              <p>Welcome to Heng Makara (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us at contact@hengmakara.com.</p>
            </div>

            <div className="policy-block mb-4">
              <h4>2. Information We Collect</h4>
              <p>We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website, or otherwise when you contact us.</p>
              <ul>
                <li>Personal Data: Name, email address, phone number, and social media handles.</li>
                <li>Project Data: Details regarding your account recovery or marketing needs.</li>
              </ul>
            </div>

            <div className="policy-block mb-4">
              <h4>3. How We Use Your Information</h4>
              <p>We use the information we collect or receive:</p>
              <ul>
                <li>To provide and deliver the services you request (including Account Recovery and Digital Marketing).</li>
                <li>To communicate with you regarding your project status.</li>
                <li>To send administrative information to you.</li>
                <li>To post testimonials (with your consent).</li>
              </ul>
            </div>

            <div className="policy-block mb-4">
              <h4>4. Data Security</h4>
              <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.</p>
            </div>

            <div className="policy-block mb-4">
              <h4>5. Contact Us</h4>
              <p>If you have questions or comments about this policy, you may email us at contact@hengmakara.com or by post to:</p>
              <p>
                Heng Makara<br />
                Phnom Penh, Cambodia<br />
                (+855) 061 212 226
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
