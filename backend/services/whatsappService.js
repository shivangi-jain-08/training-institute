const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendWhatsAppReminder = async (member) => {
  try {
    const endDate = new Date(member.subscriptionEndDate).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const message = `Hi ${member.fullName},

This is a reminder that your subscription will expire on ${endDate}.

Please renew to continue enjoying our services.

Thank you!`;

    const response = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
      to: `whatsapp:${member.contactNumber}`,
      body: message
    });

    console.log('WhatsApp message sent successfully:', response.sid);

    return { 
      success: true, 
      messageId: response.sid,
      message: 'Reminder sent successfully via Twilio WhatsApp'
    };

  } catch (error) {
    console.error('Twilio WhatsApp send error:', error);
    
    if (error.code === 21614) {
      return { 
        success: false, 
        error: 'Phone number not in WhatsApp sandbox. Please join the sandbox first.' 
      };
    }
    
    if (error.code === 20003) {
      return { 
        success: false, 
        error: 'Invalid phone number format. Please include country code.' 
      };
    }

    return { 
      success: false, 
      error: error.message || 'Failed to send WhatsApp message'
    };
  }
};

const sendBulkReminders = async (members) => {
  const results = [];
  
  for (const member of members) {
    const result = await sendWhatsAppReminder(member);
    results.push({
      memberId: member._id,
      memberName: member.fullName,
      contactNumber: member.contactNumber,
      ...result
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return results;
};

module.exports = {
  sendWhatsAppReminder,
  sendBulkReminders
};