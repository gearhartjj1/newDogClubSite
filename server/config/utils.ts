const paymentMethodNames: { [key: number]: string } = {
      1: 'PayPal',
      2: 'Cash',
      3: 'Check',
      4: 'Instructor Perk',
      7: 'Waitlist',
    };

export const getEnrollmentEmail = (spotsOpen: boolean, forcedWaitlist: boolean, paymentMethod: number, req: any, newIdValue: string, newUserCreated: boolean, newUserPassword: string): string => {
    if (spotsOpen) {
        const siteUrl = process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? process.env.RAILWAY_PUBLIC_DOMAIN && `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : 'http://localhost:5173');
        const paymentLink = `${siteUrl}/profile/${newIdValue}`;
        const paymentMethodDisplay = paymentMethodNames[paymentMethod] || `Unknown (${paymentMethod})`;
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
                Keystone Canine Training Club - Enrollment Confirmation
            </h2>
            <p>We have received your enrollment; the details are displayed below. Please review them.</p>
            <p>If any of this information is not correct, please reply to this message so that we can correct any problems.</p>
            <p>If we should find any issues with your enrollment, we will contact you. There is no need for you to contact us to confirm receipt of your enrollment.</p>
            ${paymentMethod !== 1 ? '<p><strong>Unless you use PayPal, bring your payment (cash or check) to the first class and give it to your instructor.</strong></p>' : ''}
            ${paymentMethod == 1 ? `<p>To pay for the class through PayPal, please do so through your account: <a href="${paymentLink}" target="_blank">Pay now</a></p>` : ''}
            <p>Thank you for choosing Keystone Canine Training Club. We look forward to seeing you in class!</p>
            ${newUserCreated ? `<p><strong>A new account has been created for you.</strong></p>
            <p>Your temporary password is: <strong>${newUserPassword}</strong></p>
            <p>Please log in and change your password as soon as possible.</p>` : ''}
            <p><em>If you are not a KCTC member, please bring a copy of your dog's up-to-date vaccine records and your signed Liability Waiver to your first class and give it to your instructor.</em></p>
            <hr style="border: 1px solid #3498db; margin: 20px 0;" />
            <h3 style="color: #2c3e50;">Enrollment Information</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background-color: #f8f9fa;">
                <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Signup ID</td>
                <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${newIdValue}</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Class Code</td>
                <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${req.body.dogClassCode}</td>
                </tr>
                <tr>
                <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Account holder name</td>
                <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${req.body.firstName} ${req.body.lastName}</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Dog Name</td>
                <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${req.body.dogName}</td>
                </tr>
                <tr>
                <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Dog Breed</td>
                <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${req.body.dogBreed}</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Dog Age</td>
                <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${req.body.dogAge}</td>
                </tr>
                <tr>
                <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Payment Method</td>
                <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${paymentMethodDisplay}</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Class Name</td>
                <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${req.body.dogClassName}</td>
                </tr>
            </table>
            </div>`;
    } else {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #e74c3c;">Class Full - Waitlisted</h2>
            <p>${!forcedWaitlist ? "We have received your request to be WAITLISTED for the class displayed below." : "***** Sorry, while you were enrolling, someone else completed their enrollment taking the last spot in the class displayed below.  *****"}</p>
            <p>We will contact you if a spot becomes available.</p>
            <hr style="border: 1px solid #e74c3c; margin: 20px 0;" />
            <h3 style="color: #2c3e50;">Waitlist Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background-color: #f8f9fa;">
                <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Signup ID</td>
                <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${newIdValue}</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Class Code</td>
                <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${req.body.dogClassCode}</td>
                </tr>
                <tr>
                <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Class Name</td>
                <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${req.body.dogClassName}</td>
                </tr>
                <tr>
                <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Dog Name</td>
                <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${req.body.dogName}</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Dog Breed</td>
                <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${req.body.dogBreed}</td>
                </tr>
                <tr>
                <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Dog Age</td>
                <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${req.body.dogAge}</td>
                </tr>
            </table>
            </div>`;
    }
}