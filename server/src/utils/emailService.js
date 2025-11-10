// Email service utility
// This can be extended to use services like Nodemailer, SendGrid, etc.

const sendEmail = async (to, subject, message) => {
  try {
    // TODO: Implement email sending logic
    // For now, just log the email
    console.log('Email to:', to);
    console.log('Subject:', subject);
    console.log('Message:', message);
    
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

const sendContactNotification = async (messageData) => {
  const subject = `New Contact Message: ${messageData.subject}`;
  const message = `
    Name: ${messageData.name}
    Email: ${messageData.email}
    Phone: ${messageData.phone || 'N/A'}
    
    Message:
    ${messageData.message}
  `;

  // Send to admin email (from env)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ucaep.com';
  return await sendEmail(adminEmail, subject, message);
};

module.exports = {
  sendEmail,
  sendContactNotification
};

