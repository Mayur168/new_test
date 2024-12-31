const ContactModel = require('./Models/Contact');
const { required } = require("joi");


const Contact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate input (Optional but recommended)
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: 'All fields are required.',
        success: false,
      });
    }

    // Save contact form data to the database
    const newContact = new ContactModel({ name, email, subject, message });
    await newContact.save();

    res.status(201).json({
      message: 'Contact form submitted successfully!',
      success: true,
    });
  } catch (err) {
    console.error('Error saving contact:', err);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

module.exports = {
  Contact,
};
