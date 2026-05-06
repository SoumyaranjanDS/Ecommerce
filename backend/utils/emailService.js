import nodemailer from "nodemailer";

let transporter;

const getTransporter = async () => {
  if (transporter) return transporter;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (user && pass) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: { user, pass },
    });
  } else {
    console.log("No email credentials found in .env. Creating a test account...");
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log("Test account created: %s", testAccount.user);
    } catch (err) {
      console.error("Failed to create test account, falling back to console-only mode");
      transporter = {
        sendMail: async (mailOptions) => {
          console.log("--- MOCK EMAIL SENT ---");
          console.log("To:", mailOptions.to);
          console.log("Subject:", mailOptions.subject);
          console.log("Body:", mailOptions.text);
          return { messageId: "mock-id" };
        }
      };
    }
  }
  return transporter;
};

export const sendOrderConfirmation = async (userEmail, orderDetails) => {
  try {
    const transport = await getTransporter();
    const info = await transport.sendMail({
      from: '"Ecommerce Store" <noreply@ecomstore.com>',
      to: userEmail,
      subject: `Order Confirmation - #${orderDetails._id}`,
      text: `Thank you for your order! Total amount: Rs. ${orderDetails.totalPrice}. Status: ${orderDetails.status}.`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #111827;">Order Confirmed!</h2>
          <p>Hi there,</p>
          <p>Thank you for shopping with us. Your order <strong>#${orderDetails._id}</strong> has been received and is being processed.</p>
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">Order Summary:</p>
            <p style="margin: 5px 0;">Total Amount: <span style="color: #111827; font-weight: bold;">Rs. ${orderDetails.totalPrice}</span></p>
            <p style="margin: 5px 0;">Status: <span style="text-transform: capitalize;">${orderDetails.status}</span></p>
          </div>
          <p>We'll notify you once your order is shipped.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #6b7280;">If you have any questions, contact our support team.</p>
        </div>
      `,
    });
    console.log("Email sent: %s", info.messageId);
    if (info.messageId !== "mock-id" && info.test) {
       console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    return null;
  }
};

export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transport = await getTransporter();
    const info = await transport.sendMail({
      from: '"Ecommerce Store" <noreply@ecomstore.com>',
      to: userEmail,
      subject: `Welcome to Our Store, ${userName}!`,
      text: `Hi ${userName}, thanks for joining us! We're excited to have you.`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #111827;">Welcome Aboard!</h2>
          <p>Hi <strong>${userName}</strong>,</p>
          <p>We're thrilled to have you as part of our community. Explore our latest collection and start shopping today!</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Start Shopping</a>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #6b7280;">If you didn't sign up for this account, please ignore this email.</p>
        </div>
      `,
    });
    console.log("Welcome email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return null;
  }
};

export const sendAbandonedCartEmail = async (email, name, itemCount) => {
  const mailOptions = {
    from: `"STAKY Premium" <${process.env.EMAIL_USER || "test@ethereal.email"}>`,
    to: email,
    subject: "Still thinking about it? We saved your bag!",
    html: `
      <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: auto; padding: 40px; background-color: #F8F8F8; border-radius: 40px; color: #1A1A2E;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; padding: 10px 20px; background-color: #1A1A2E; color: white; border-radius: 12px; font-weight: 900; font-size: 24px;">S</div>
        </div>
        <h1 style="font-size: 32px; font-weight: 900; text-align: center; margin-bottom: 10px;">Don't miss out, ${name}!</h1>
        <p style="text-align: center; font-size: 16px; color: #6B7280; margin-bottom: 30px;">
          You left ${itemCount} items in your shopping bag. They're waiting for you, but they won't last long!
        </p>
        <div style="background-color: white; padding: 30px; border-radius: 30px; text-align: center; border: 1px dashed #E5E7EB; margin-bottom: 30px;">
          <p style="text-transform: uppercase; font-weight: 900; font-size: 10px; letter-spacing: 2px; color: #E94560; margin-bottom: 10px;">Special Gift for You</p>
          <h2 style="font-size: 24px; font-weight: 900; margin-bottom: 5px;">GET 10% OFF</h2>
          <p style="font-size: 14px; color: #6B7280; margin-bottom: 20px;">Use code at checkout</p>
          <div style="display: inline-block; padding: 15px 40px; background-color: #F8F8F8; border: 2px dashed #1A1A2E; border-radius: 20px; font-weight: 900; font-size: 20px; letter-spacing: 2px;">
            COMEBACK10
          </div>
        </div>
        <div style="text-align: center;">
          <a href="http://localhost:5173/cart" style="display: inline-block; padding: 20px 50px; background-color: #E94560; color: white; text-decoration: none; border-radius: 20px; font-weight: 900; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; box-shadow: 0 10px 30px rgba(233, 69, 96, 0.3);">
            Complete My Purchase
          </a>
        </div>
        <p style="text-align: center; font-size: 12px; color: #9CA3AF; margin-top: 40px;">
          Terms apply. Discount code valid for 24 hours.
        </p>
      </div>
    `,
  };

  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail(mailOptions);
    if (transporter.options && transporter.options.host === "smtp.ethereal.email") {
      console.log(`Abandoned cart email preview: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (error) {
    console.error("Error sending abandoned cart email:", error);
  }
};
