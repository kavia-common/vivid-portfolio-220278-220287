'use strict';

const Message = require('../models/Message');

// PUBLIC_INTERFACE
async function submitMessage(req, res, next) {
  /** Stores contact message. Optional email notification is stubbed. */
  try {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email, and message are required' });
    }
    const doc = await Message.create({
      name,
      email,
      subject: subject || '',
      message,
      ip: req.ip,
      userAgent: req.headers['user-agent'] || '',
    });

    // Email stub (extend with nodemailer if desired)
    if (process.env.EMAIL_ENABLED === 'true') {
      // Here you could integrate nodemailer or any email service.
      // This is a stub to indicate where email would be sent.
      // console.log(`Would send email to ${process.env.CONTACT_INBOX} about message ${doc._id}`);
    }

    return res.status(201).json({ success: true, id: doc._id });
  } catch (e) {
    return next(e);
  }
}

module.exports = { submitMessage };
