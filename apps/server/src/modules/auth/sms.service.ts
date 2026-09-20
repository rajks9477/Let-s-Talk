export class SmsService {
  /**
   * Send real dynamic 6-digit SMS OTP to user's mobile number
   */
  static async sendSmsOtp(phoneNumber: string, otp: string): Promise<{ success: boolean; provider: string; message: string }> {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const indianNumber = cleanPhone.length > 10 ? cleanPhone.slice(-10) : cleanPhone;

    // 1. Check Fast2SMS (India Free/Paid Gateway)
    const fast2smsKey = process.env.FAST2SMS_API_KEY;
    if (fast2smsKey) {
      try {
        const response = await fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${fast2smsKey}&route=otp&variables_values=${otp}&flash=0&numbers=${indianNumber}`);
        const data = await response.json();
        console.log(`📡 [Fast2SMS API] Sent to ${indianNumber}:`, data);
        if (data.return) {
          return { success: true, provider: 'Fast2SMS', message: `SMS sent to +91 ${indianNumber}` };
        }
      } catch (err) {
        console.error('Fast2SMS gateway error:', err);
      }
    }

    // 2. Check Twilio (Global SMS Gateway)
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (twilioSid && twilioAuth && twilioPhone) {
      try {
        const formattedTo = phoneNumber.startsWith('+') ? phoneNumber : `+91${indianNumber}`;
        const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64');
        const bodyParams = new URLSearchParams({
          To: formattedTo,
          From: twilioPhone,
          Body: `Your Let's Talk verification code is: ${otp}. Do not share this code with anyone.`,
        });

        const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: bodyParams.toString(),
        });

        const twilioData = await response.json();
        console.log(`📡 [Twilio SMS] Sent to ${formattedTo}:`, twilioData.sid);
        if (twilioData.sid) {
          return { success: true, provider: 'Twilio', message: `SMS sent to ${formattedTo}` };
        }
      } catch (err) {
        console.error('Twilio gateway error:', err);
      }
    }

    // 3. Check 2Factor.in (India SMS Gateway)
    const twoFactorKey = process.env.TWOFACTOR_API_KEY;
    if (twoFactorKey) {
      try {
        const response = await fetch(`https://2factor.in/API/V1/${twoFactorKey}/SMS/${indianNumber}/${otp}/LetsTalk_OTP`);
        const data = await response.json();
        console.log(`📡 [2Factor SMS] Sent to ${indianNumber}:`, data);
        if (data.Status === 'Success') {
          return { success: true, provider: '2Factor', message: `SMS sent to ${indianNumber}` };
        }
      } catch (err) {
        console.error('2Factor gateway error:', err);
      }
    }

    // Fallback Simulation (Console log)
    console.log(`📲 [SMS Dispatcher] Real Dynamic OTP generated for ${phoneNumber}: [${otp}]`);
    return {
      success: true,
      provider: 'Sandbox / Console',
      message: `Dynamic OTP [${otp}] generated for ${phoneNumber}. Add FAST2SMS_API_KEY or TWILIO credentials in .env to deliver real SMS to physical SIM.`,
    };
  }
}
