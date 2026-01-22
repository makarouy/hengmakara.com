import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const newMessage = {
      id: Date.now(),
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
      read: false
    };

    // Save to DB
    await db.create('messages', newMessage);

    // Send Email via Google Workspace
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const mailOptions = {
          from: `"${name}" <${process.env.EMAIL_USER}>`, // Send from yourself to yourself (to avoid spam blocks)
          replyTo: email, // But reply to the user
          to: process.env.EMAIL_USER,
          subject: `New Website Message: ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          html: `
            <h3>New Contact Message</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <hr/>
            <p style="white-space: pre-wrap;">${message}</p>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${process.env.EMAIL_USER}`);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        
        if (emailError.responseCode === 535) {
          console.error('\n\x1b[31m%s\x1b[0m', '❌ GMAIL AUTHENTICATION ERROR:');
          console.error('It looks like you are using your Gmail password directly.');
          console.error('For security, Google requires an "App Password" for third-party apps.');
          console.error('1. Go to Google Account > Security');
          console.error('2. Enable 2-Step Verification if not enabled');
          console.error('3. Search for "App Passwords"');
          console.error('4. Create a new App Password for "Mail"');
          console.error('5. Use THAT password in your .env.local file as EMAIL_PASS\n');
        }
        // Do not fail the request, as the DB save was successful
      }
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
