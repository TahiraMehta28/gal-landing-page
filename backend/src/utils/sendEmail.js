import nodemailer from 'nodemailer';
import https from 'https';

let pooledTransporter = null;

function getTransporter(user, pass) {
  if (!pooledTransporter) {
    pooledTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
      pool: true,
      maxConnections: 3,
      maxMessages: 50,
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
  return pooledTransporter;
}

// Helper to make HTTPS POST request to Vercel Email Bridge
async function sendViaHttpsBridge(endpointUrl, payload) {
  try {
    const urlObj = new URL(endpointUrl);
    const postData = JSON.stringify(payload);

    return new Promise((resolve) => {
      const req = https.request(
        {
          hostname: urlObj.hostname,
          port: urlObj.port || 443,
          path: urlObj.pathname,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'User-Agent': 'GAL-Backend-MailBridge/1.0',
          },
          timeout: 8000,
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            try {
              const parsed = JSON.parse(data);
              if (res.statusCode >= 200 && res.statusCode < 300 && parsed.success) {
                resolve({ success: true, messageId: parsed.messageId, endpoint: endpointUrl });
              } else {
                resolve({ success: false, error: parsed.message || parsed.error || `HTTP ${res.statusCode}` });
              }
            } catch (e) {
              resolve({ success: false, error: `Invalid JSON (HTTP ${res.statusCode})` });
            }
          });
        }
      );

      req.on('timeout', () => {
        req.destroy();
        resolve({ success: false, error: 'HTTPS request timed out' });
      });

      req.on('error', (err) => {
        resolve({ success: false, error: err.message });
      });

      req.write(postData);
      req.end();
    });
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export const sendEmail = async ({ to, subject, html, text, origin, clientOrigin }) => {
  const user = process.env.EMAIL_USER?.trim() || 'tahiram.cs.23@nitj.ac.in';
  const pass = process.env.EMAIL_PASS?.replace(/\s+/g, '') || 'lxoyduateasrtwfn';
  const rawFromName = process.env.FROM_NAME || 'GAL Acceleration Lab';
  const fromName = rawFromName.replace(/^["']|["']$/g, '').trim();
  const cleanTo = to?.trim().toLowerCase();

  const mailOptions = {
    from: `"${fromName}" <${user}>`,
    to: cleanTo,
    subject,
    text,
    html,
  };

  // Build candidate HTTPS bridge endpoints
  const bridgeEndpoints = [];
  const rawOrigin = clientOrigin || origin || process.env.CLIENT_URL;

  if (rawOrigin && typeof rawOrigin === 'string' && rawOrigin.startsWith('http')) {
    try {
      const u = new URL(rawOrigin);
      bridgeEndpoints.push(`${u.origin}/api/send-email`);
    } catch (e) {}
  }

  // Add known deployed Vercel domains as fallback bridges
  const fallbackDomains = [
    'https://gal-landing-page-om5r.vercel.app/api/send-email',
    'https://gal-landing-page.vercel.app/api/send-email',
  ];

  for (const domain of fallbackDomains) {
    if (!bridgeEndpoints.includes(domain)) {
      bridgeEndpoints.push(domain);
    }
  }

  const isCloudEnvironment = Boolean(
    process.env.RENDER ||
    process.env.VERCEL ||
    process.env.NODE_ENV === 'production' ||
    (rawOrigin && rawOrigin.includes('vercel.app'))
  );

  console.log(`📧 Preparing email dispatch for ${cleanTo} - [${subject}]`);
  console.log(`🌐 Environment: ${isCloudEnvironment ? 'Cloud / Production' : 'Local / Development'}`);

  // Strategy 1: If on Cloud (like Render where outbound SMTP ports 465/587 are blocked), try HTTPS bridge first
  if (isCloudEnvironment) {
    for (const endpoint of bridgeEndpoints) {
      console.log(`🚀 Attempting HTTPS mail delivery via bridge: ${endpoint}`);
      const bridgeResult = await sendViaHttpsBridge(endpoint, {
        to: cleanTo,
        subject,
        html,
        text,
      });

      if (bridgeResult.success) {
        console.log(`✅ Real Email delivered via HTTPS Bridge: ${cleanTo} (Message ID: ${bridgeResult.messageId})`);
        return { messageId: bridgeResult.messageId, method: 'https-bridge' };
      }
      console.warn(`⚠️ HTTPS Bridge ${endpoint} failed: ${bridgeResult.error}. Trying next fallback...`);
    }
  }

  // Strategy 2: Direct SMTP connection (Port 465 SSL)
  console.log(`🚀 Attempting direct SMTP delivery to: ${cleanTo} via smtp.gmail.com:465 (SSL)`);
  try {
    const transporter = getTransporter(user, pass);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Real Email delivered via Direct SMTP: ${cleanTo} (Message ID: ${info.messageId})`);
    return { messageId: info.messageId, method: 'direct-smtp-465' };
  } catch (err465) {
    console.warn(`⚠️ Direct SMTP port 465 failed for ${cleanTo} (${err465.message}). Trying port 587...`);
    pooledTransporter = null;

    // Strategy 3: Direct SMTP connection (Port 587 STARTTLS)
    try {
      const transporter587 = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 6000,
        greetingTimeout: 6000,
        socketTimeout: 6000,
      });

      const info587 = await transporter587.sendMail(mailOptions);
      console.log(`✅ Real Email delivered via Direct SMTP 587: ${cleanTo} (Message ID: ${info587.messageId})`);
      return { messageId: info587.messageId, method: 'direct-smtp-587' };
    } catch (err587) {
      console.warn(`⚠️ Direct SMTP port 587 failed (${err587.message}).`);

      // If local and hadn't tried HTTPS bridges yet, try them now as final safety net
      if (!isCloudEnvironment) {
        for (const endpoint of bridgeEndpoints) {
          console.log(`🚀 Trying fallback HTTPS mail bridge: ${endpoint}`);
          const bridgeResult = await sendViaHttpsBridge(endpoint, {
            to: cleanTo,
            subject,
            html,
            text,
          });

          if (bridgeResult.success) {
            console.log(`✅ Email delivered via fallback HTTPS Bridge: ${cleanTo} (ID: ${bridgeResult.messageId})`);
            return { messageId: bridgeResult.messageId, method: 'fallback-https-bridge' };
          }
        }
      }

      console.error(`❌ All email delivery channels failed for ${cleanTo}:`, err587.message);
      return { error: err587.message };
    }
  }
};
