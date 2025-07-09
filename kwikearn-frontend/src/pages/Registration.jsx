import React, { useState, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import "@fontsource/sora";
import "@fontsource/inter";

export default function Registration() {
  const [step, setStep] = useState(1);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("");

  const avatarOptions = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Olivia", // female
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Leo",     // male
  "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Zara", // neutral
  "https://api.dicebear.com/7.x/micah/svg?seed=Aisha",         // female
  "https://api.dicebear.com/7.x/big-smile/svg?seed=Chris",     // male
  "https://api.dicebear.com/7.x/big-ears/svg?seed=Nina",       // female
  "https://api.dicebear.com/7.x/bottts/svg?seed=Max",          // fun neutral
];
  const steps = [
  { icon: "💰", text: "Pay ₵100 one-time to activate your account." },
  { icon: "🔑", text: "Receive a unique referral code after signup." },
  { icon: "💵", text: "Earn ₵20 whenever someone joins using your code." },
  { icon: "♾️", text: "Refer unlimited people — earn ₵20 for each." },
  { icon: "🚀", text: "Everyone you refer can also start earning by sharing their own code." },
];
  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bitcoin");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);

  const BTC_ADDRESS = "bc1qzllw832k6m6p5mk9tzp2pv3ys66sw6tta2w4u8";

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (!country) {
      alert("Please select your country");
      return;
    }
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = {
      country,
      paymentMethod,
      name,
      email,
      password,
      referralCode,
    };

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        setStep(1);
        setCountry("");
        setPaymentMethod("Bitcoin");
        setName("");
        setEmail("");
        setPassword("");
        setReferralCode("");
        setShowPassword(false);
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // Brand logo as SVG component
  const BrandLogo = () => (
    <svg
      width="48"
      height="48"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="brandGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#32e0c4" />
          <stop offset="100%" stopColor="#1bb89f" />
        </linearGradient>
      </defs>
      {/* Abstract stylized "K" and "L" interwoven */}
      <path
        d="M12 52 L28 12 L44 52 L36 52 L32 40 L28 52 Z"
        fill="url(#brandGradient)"
        stroke="#1bb89f"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="32" r="10" stroke="#32e0c4" strokeWidth="2" fill="none" />
    </svg>
  );

  return (
    <>
      {/* Announcement Dropdown */}
      <div
        className={`announcement-dropdown ${showAnnouncement ? "open" : ""}`}
        role="region"
        aria-live="polite"
        aria-label="Payment announcement"
      >
        <div className="announcement-content">
          <strong>📢 Payment Instructions:</strong> To continue, pay{" "}
          <strong>₵100 worth of Bitcoin</strong> to: <br />
          <code className="btc-address">{BTC_ADDRESS}</code>
          <button
            onClick={() => setShowAnnouncement(false)}
            aria-label="Close payment announcement"
            className="close-announcement"
            title="Close"
          >
            ×
          </button>
        </div>
      </div>

      {/* Success Notification Dropdown with project description */}
      <div
        className={`success-dropdown ${showSuccess ? "show" : ""}`}
        role="alert"
        aria-live="assertive"
      >
        <div className="success-content">
          <h3>How KwikLoom Works</h3>
          <p>KwikLoom is a referral-based commission system powered by initial signup payments.</p>
          <p>Here’s the process:</p>
          <ul>
            <li>Each user must pay ₵100 (Ghana cedis) to create their account.</li>
            <li>After signing up, users receive a unique referral code.</li>
            <li>
              When someone signs up using that code and pays ₵100, the referrer earns ₵20
              commission.
            </li>
            <li>
              Commissions are one-time per referral, but users can refer unlimited people for more
              earnings.
            </li>
            <li>
              Referred users can also earn ₵20 for their own referrals, creating a chain of
              commissions.
            </li>
          </ul>
          <button
            onClick={() => setShowSuccess(false)}
            aria-label="Dismiss project description"
            className="close-success"
            title="Dismiss"
          >
            ×
          </button>
        </div>
      </div>

      <div className="root-container">
        {/* Brand Header */}
        <header className="brand-header" role="banner" aria-label="KwikLoom brand">
          <BrandLogo />
          <div className="brand-text">
            <h1 className="brand-name">KwikLoom</h1>
            <p className="brand-slogan">Weaving Rewards. Fast. Secure. Yours.</p>
          </div>
        </header>

        {/* Bitcoin Icon */}
        <div className="btc-icon" aria-hidden="true">
          <img
            src="https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/btc.png"
            alt="Bitcoin"
            width={48}
            height={48}
          />
        </div>

        <main className="form-box" role="main" aria-labelledby="register-title">
          {step === 1 && (
            <>
              <h2 id="register-title" className="form-title">
                Register to KwikLoom
              </h2>
              <div className="how-it-works">
               <h3>Here’s how it works:</h3>
               <ul>
                 <ul className="steps-list">
  <li><span className="step-icon">💰</span> Pay ₵100 one-time to activate your account.</li>
  <li><span className="step-icon">🔑</span> Receive a unique referral code after signup.</li>
  <li><span className="step-icon">💵</span> Earn ₵20 whenever someone joins using your code.</li>
  <li><span className="step-icon">♾️</span> Refer unlimited people — earn ₵20 for each.</li>
  <li><span className="step-icon">🚀</span> Everyone you refer can also start earning by sharing their own code.</li>
</ul>

               </ul>
            </div>

              <div className="auth-buttons">
  <button
    onClick={() => setStep("email")}
    className="email-auth-btn"
  >
    📧 Sign in with Email
  </button>

  <button
    onClick={() => signInWithPopup(auth, provider)}
    className="google-auth-btn"
  >
    <img 
  src="https://developers.google.com/identity/images/g-logo.png"
  alt="Google"
  style={{ width: 24, height: 24, marginRight: 8 }}
/>
    Sign in with Google
  </button>
</div>

              <form onSubmit={handleInitialSubmit} className="form">
                {/* Dropdowns */}
                <label htmlFor="country-select" className="sr-only">
                  Select your country
                </label>
                <select
                  id="country-select"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="select-field"
                  required
                >
                  <option value="" disabled>
                    Select your country
                  </option>
                  <option value="Ghana">Ghana</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Kenya">Kenya</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Other">Other</option>
                </select>

                <label htmlFor="payment-select" className="sr-only">
                  Select payment method
                </label>
                <select
                  id="payment-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="select-field"
                  required
                >
                  <option value="Bitcoin">Bitcoin</option>
                  <option value="Ethereum">Ethereum</option>
                  <option value="Litecoin">Litecoin</option>
                </select>

                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input-field"
                  autoComplete="name"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field"
                  autoComplete="email"
                />

                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-field password-input"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-btn"
                    tabIndex={-1}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="icon-eye"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-3.582-9-8s4-8 9-8a9.96 9.96 0 015.64 1.9M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="icon-eye-off"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-3.582-9-8 0-1.207.34-2.4.96-3.45M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="payment-instruction" aria-live="polite">
                  <strong>📢 To continue, pay ₵100 worth of {paymentMethod} to:</strong>
                  <code className="btc-address">{BTC_ADDRESS}</code>
                </div>

                {paymentMethod === "Bitcoin" && (
                  <div className="qr-code-container" aria-hidden="true">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?data=bitcoin:${BTC_ADDRESS}&size=160x160`}
                      alt="Bitcoin payment QR code"
                      className="qr-code"
                    />
                  </div>
                )}
   <div className="avatar-grid">
  <p className="avatar-heading">Choose Your Avatar</p>
  <div className="grid grid-cols-3 gap-4 justify-center">
    {avatarOptions.map((url) => (
      <img
        key={url}
        src={url}
        alt="Avatar option"
        className={`w-16 h-16 rounded-full border-4 cursor-pointer transition-transform ${
          selectedAvatar === url ? "border-green-400 scale-110" : "border-transparent"
        }`}
        onClick={() => setSelectedAvatar(url)}
      />
    ))}
  </div>
</div>

                <button type="submit" className="btn-primary">
                  I’ve Paid – Continue
                </button>

                <div className="form-links">
                  <a href="#login" onClick={(e) => e.preventDefault()}>
                    Login
                  </a>
                  <a href="#forgot-password" onClick={(e) => e.preventDefault()} className="ml-6">
                    Forgot Password?
                  </a>
                </div>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h2 id="referral-title" className="form-title">
                Enter Referral Code
              </h2>
              <form onSubmit={handleFinalSubmit} className="form">
                <input
                  type="text"
                  placeholder="Referral Code"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="input-field"
                  required
                  autoComplete="off"
                />
                <button disabled={loading} type="submit" className="btn-primary">
                  {loading ? "Validating..." : "Complete Registration"}
                </button>
              </form>
            </>
          )}
        </main>{step === "email" && (
  <>
    <h2 className="form-title">Sign in with Email</h2>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert("This will sign in with email!");
        // Later: handleEmailLogin(email, password)
      }}
      className="form"
    >
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="input-field"
      />

      <input
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="input-field"
      />

      <button type="submit" className="btn-primary">
        Sign In
      </button>

      <p style={{ marginTop: "1rem" }}>
        Don’t have an account?{" "}
        <a
          href="#back"
          onClick={(e) => {
            e.preventDefault();
            setStep(1); // Go back to welcome screen
          }}
          style={{ color: "#0fd3b0", textDecoration: "underline" }}
        >
          Register here
        </a>
      </p>
    </form>
  </>
)}

      </div>
{/* Styles */}
      <style jsx>{`
        :root {
          font-family: "Sora", system-ui, sans-serif;
          color-scheme: dark;
          background-color: #0a0f1c;
          color: #b4e9db;
          line-height: 1.5;
        }
        .root-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center; /* Center vertically */
          padding: 3rem 1rem 4rem;
          background-image:
            radial-gradient(circle at top left, #0ff, transparent 25%),
            radial-gradient(circle at bottom right, #0f8, transparent 25%),
            repeating-linear-gradient(45deg, #0a0f1c 0, #0a0f1c 10px, #09111b 10px, #09111b 20px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1), rgba(0, 255, 0, 0.1));
          background-blend-mode: screen;
          background-repeat: no-repeat;
          background-size: cover;
          animation: background-shift 15s ease-in-out infinite;
          box-sizing: border-box;
          color: #b4e9db;
          text-align: center; /* Center text inside */
        }
        @keyframes background-shift {
          0%,
          100% {
            background-position: 0% 0%, 100% 100%, 0 0, 0 0;
          }
          50% {
            background-position: 25% 25%, 75% 75%, 10px 10px, 0 0;
          }
        }

        /* Brand Header */
        .brand-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          margin-bottom: 3rem;
          user-select: none;
          color: #32e0c4;
        }
        .brand-name {
          font-weight: 900;
          font-size: 2.8rem;
          line-height: 1;
          letter-spacing: 0.02em;
          text-shadow: 0 0 20px #32e0c4cc;
          user-select: text;
        }
        .brand-slogan {
          font-weight: 600;
          font-size: 1rem;
          opacity: 0.75;
          user-select: text;
        }

        /* Bitcoin Icon */
        .btc-icon {
          margin: 0 auto 1.5rem;
          animation: bounce-bitcoin 2.5s ease-in-out infinite;
          filter: drop-shadow(0 0 4px #32e0c4cc);
          width: 48px;
          height: 48px;
        }
        @keyframes bounce-bitcoin {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        /* Form Box */
        .form-box {
          background: rgba(15, 43, 37, 0.85);
          padding: 3rem 2.5rem 2.5rem 2.5rem;
          border-radius: 2rem;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 0 30px #0dcfb078, inset 0 0 15px #0dcfb0cc;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: "Sora", system-ui, sans-serif;
          user-select: none;
          color: #b4e9db;
          margin: 0 auto;
        }
        .form-title {
          color: #32e0c4;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 2rem;
          text-shadow: 0 0 15px #32e0c4cc;
          user-select: text;
          width: 100%;
          text-align: center;
        }
        form.form {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }

        /* Inputs */
        .input-field {
          width: 100%;
          padding: 1rem 1.25rem;
          border-radius: 16px;
          border: 2px solid #23695e;
          background-color: #0a3229;
          color: #b4e9db;
          font-weight: 600;
          font-size: 1.1rem;
          box-shadow: inset 0 0 6px #2dbf9bcc, 0 0 10px #0da17b99;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          margin-bottom: 1.25rem;
          user-select: text;
          font-family: "Sora", system-ui, sans-serif;
        }
        .input-field::placeholder {
          color: #7cd9bc;
          font-weight: 400;
        }
        .input-field:focus {
          outline: none;
          border-color: #3cdbc2;
          box-shadow: inset 0 0 8px #32e0c4, 0 0 15px #32e0c4;
          background-color: #04453b;
          color: #d1fff7;
        }

        /* Select */
        .select-field {
          width: 100%;
          padding: 1rem 1.25rem;
          border-radius: 14px;
          border: 2px solid #1bb89f55;
          background-color: #064535;
          font-weight: 600;
          font-size: 1.1rem;
          color: #a4ddd0;
          box-shadow: inset 0 0 10px #2dbf9bcc;
          margin-bottom: 1.5rem;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg fill='%2332e0c4' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1rem;
          user-select: text;
        }
        .select-field:focus {
          outline: none;
          border-color: #3cdbc2;
          box-shadow: inset 0 0 8px #32e0c4, 0 0 12px #32e0c4;
          background-color: #045a4a;
        }

        /* Buttons */
        .btn-primary {
          cursor: pointer;
          width: 100%;
          padding: 1rem 0;
          background: linear-gradient(135deg, #13f7c9, #11c6a3);
          font-size: 1.3rem;
          font-weight: 700;
          border-radius: 1rem;
          border: none;
          color: #004135;
          text-shadow: 0 0 3px #004135a3;
          user-select: none;
          transition: background 0.3s ease;
          box-shadow: 0 0 18px #0dcfb0cc;
        }
        .btn-primary:hover,
        .btn-primary:focus-visible {
          background: linear-gradient(135deg, #19ffe3, #0fd3b0);
          outline-offset: 2px;
          outline: 3px solid #0dd1af;
          box-shadow: 0 0 22px #1fffd0cc;
        }
        .btn-primary:disabled {
          background: #008663;
          cursor: not-allowed;
          box-shadow: none;
          color: #02331c;
          text-shadow: none;
        }

        /* Password toggle */
        .password-wrapper {
          position: relative;
          margin-bottom: 1.5rem;
        }
        .password-input {
          padding-right: 3.5rem;
        }
        .password-toggle-btn {
          position: absolute;
          top: 50%;
          right: 1rem;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          cursor: pointer;
          color: #0ee0c4;
          padding: 0;
          user-select: none;
          display: flex;
          align-items: center;
        }
        .password-toggle-btn:hover,
        .password-toggle-btn:focus-visible {
          color: #3fffd0;
          outline: none;
        }
        .icon-eye,
        .icon-eye-off {
          width: 1.5rem;
          height: 1.5rem;
        }

        /* Form links */
        .form-links {
          margin-top: 1rem;
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          user-select: text;
        }
        .form-links a {
          color: #3be7b9;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          user-select: text;
        }
        .form-links a:hover,
        .form-links a:focus-visible {
          text-decoration: underline;
          outline: none;
        }

        /* BTC Address display */
        .btc-address {
          display: block;
          background: #04382f;
          color: #0fffd0;
          font-family: monospace;
          padding: 0.6rem 1rem;
          border-radius: 0.75rem;
          user-select: all;
          margin: 0.75rem 0 1.5rem;
          font-weight: 700;
          font-size: 1rem;
          box-shadow: 0 0 12px #13f7c9cc;
          word-break: break-all;
        }

        /* Announcement Dropdown */
        .announcement-dropdown {
          position: fixed;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%) translateY(-200%);
          background: #006e53;
          color: #cffcf1;
          padding: 1rem 2rem;
          border-radius: 1rem;
          font-weight: 700;
          font-size: 1rem;
          text-align: center;
          width: 90vw;
          max-width: 600px;
          box-shadow: 0 0 25px #00ffd0bb;
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 200;
          user-select: text;
        }
        .announcement-dropdown.open {
          transform: translateX(-50%) translateY(0);
        }
        .announcement-content {
          position: relative;
        }
        .close-announcement {
          position: absolute;
          top: 0.3rem;
          right: 0.6rem;
          background: transparent;
          border: none;
          font-size: 1.3rem;
          color: #cffcf1;
          cursor: pointer;
          user-select: none;
          padding: 0 0.2rem 0 0.2rem;
          line-height: 1;
        }
        .close-announcement:hover,
        .close-announcement:focus-visible {
          color: #7ff6e6;
          outline-offset: 2px;
          outline: 2px solid #7ff6e6;
        }

        /* Success Dropdown */
        .success-dropdown {
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          background: #0a503b;
          color: #a0f0dc;
          padding: 1.5rem 2rem;
          border-radius: 1rem;
          font-weight: 600;
          font-size: 1rem;
          max-width: 320px;
          box-shadow: 0 0 20px #0fffc0cc;
          opacity: 0;
          pointer-events: none;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
          user-select: text;
          z-index: 201;
        }
        .success-dropdown.show {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }
        .success-content {
          position: relative;
        }
        .close-success {
          position: absolute;
          top: 0.3rem;
          right: 0.6rem;
          background: transparent;
          border: none;
          font-size: 1.3rem;
          color: #a0f0dc;
          cursor: pointer;
          user-select: none;
          padding: 0 0.2rem 0 0.2rem;
          line-height: 1;
        }
        .close-success:hover,
        .close-success:focus-visible {
          color: #d6fff2;
          outline-offset: 2px;
          outline: 2px solid #d6fff2;
        }
        .success-content h3 {
          margin-top: 0;
          margin-bottom: 0.5rem;
          color: #32e0c4;
          font-weight: 700;
          font-size: 1.25rem;
        }
        .success-content ul {
          padding-left: 1.25rem;
          margin: 0.5rem 0;
          text-align: left;
        }
        .success-content li {
          margin-bottom: 0.3rem;
          user-select: text;
        }

        /* QR Code */
        .qr-code-container {
          margin: 0 auto 1.8rem;
          width: 160px;
          height: 160px;
          filter: drop-shadow(0 0 10px #0fc6b9cc);
          border-radius: 0.75rem;
          user-select: none;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .qr-code {
          width: 160px;
          height: 160px;
          border-radius: 0.75rem;
          image-rendering: pixelated;
        }

        /* Screen reader only */
        .sr-only {
          border: 0 !important;
          clip: rect(1px, 1px, 1px, 1px) !important;
          -webkit-clip-path: inset(50%) !important;
          clip-path: inset(50%) !important;
          height: 1px !important;
          margin: -1px !important;
          overflow: hidden !important;
          padding: 0 !important;
          position: absolute !important;
          width: 1px !important;
          white-space: nowrap !important;
        }
      `}</style>

    </>
  );
}