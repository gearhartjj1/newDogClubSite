import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

class EmailServiceResend {
  async sendEmail(to: string, subject: string, htmlContent: string) {
    try {
      const { data, error } = await resend.emails.send({
        from: `KCTC <${process.env.CLUB_EMAIL}>`,
        to,
        subject,
        html: htmlContent,
      });

      if (error) {
        console.error('Resend error:', error);
        throw new Error(error.message);
      }

      console.log('Email sent successfully:', data?.id);
      return data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendBatchEmails(
    recipients: string[],
    subject: string,
    htmlContent: string
  ) {
    try {
      const { data, error } = await resend.batch.send(
        recipients.map((to) => ({
          from: `KCTC <${process.env.CLUB_EMAIL}>`,
          to,
          subject,
          html: htmlContent,
        }))
      );

      if (error) {
        console.error('Resend batch error:', error);
        throw new Error(error.message);
      }

      console.log('Batch emails sent:', data);
      return data;
    } catch (error) {
      console.error('Error sending batch emails:', error);
      throw error;
    }
  }
}

export default new EmailServiceResend();