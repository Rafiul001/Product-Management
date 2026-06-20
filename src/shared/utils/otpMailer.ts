export const otpMail = (email: string, otp: string) => ({
  to: email,
  subject: "Your OTP Verification Code",
  html: `
    <div style="font-family:Arial">
      <h2>Verify your account</h2>
      <p>Your OTP is:</p>
      <h1 style="letter-spacing:6px;">${otp}</h1>
      <h3>Expiration time 2 minutes.</h3>
    </div>
  `,
});
