import https from 'https';

/**
 * Sends email via the Vercel serverless bridge.
 * Render free tier blocks outbound SMTP (ports 465/587), so we route
 * all email through the Vercel /api/send-email function which CAN use SMTP.
 */
async function sendViaVercelBridge(payload) {
  const endpoints = [
    'gal-landing-page-om5r.vercel.app',
    'gal-landing-page.vercel.app',
  ];

  const postData = JSON.stringify(payload);

  for (const hostname of endpoints) {
    try {
      const result = await new Promise((resolve) => {
        const req = https.request(
          {
            hostname,
            port: 443,
            path: '/api/send-email',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(postData),
            },
            timeout: 12000,
          },
          (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
              try {
                const parsed = JSON.parse(data);
                resolve({ status: res.statusCode, parsed });
              } catch (e) {
                resolve({ status: res.statusCode, parsed: { success: false, error: 'Invalid JSON' } });
              }
            });
          }
        );
        req.on('timeout', () => { req.destroy(); resolve({ status: 0, parsed: { success: false, error: 'Timeout' } }); });
        req.on('error', (err) => resolve({ status: 0, parsed: { success: false, error: err.message } }));
        req.write(postData);
        req.end();
      });

      console.log(`📡 Bridge [${hostname}] responded ${result.status}: ${JSON.stringify(result.parsed)}`);

      if (result.parsed.success) {
        return { ok: true, messageId: result.parsed.messageId };
      }

      // If credentials missing on Vercel, log clearly
      if (result.parsed.message?.includes('EMAIL_USER') || result.parsed.message?.includes('EMAIL_PASS')) {
        console.error('❌ Vercel bridge has no email credentials. Go to Vercel Dashboard → Project → Settings → Environment Variables and add EMAIL_USER and EMAIL_PASS.');
      }
    } catch (err) {
      console.warn(`⚠️ Bridge ${hostname} threw: ${err.message}`);
    }
  }

  return { ok: false, error: 'All bridge endpoints failed' };
}

export const sendEmail = async ({ to, subject, html, text }) => {
  const cleanTo = (to || '').trim().toLowerCase();
  console.log(`📧 [sendEmail] Dispatching to: ${cleanTo} | Subject: ${subject}`);

  const result = await sendViaVercelBridge({ to: cleanTo, subject, html, text });

  if (result.ok) {
    console.log(`✅ Email delivered to ${cleanTo} (ID: ${result.messageId})`);
    return { messageId: result.messageId };
  }

  console.error(`❌ Email failed for ${cleanTo}: ${result.error}`);
  return { error: result.error };
};
