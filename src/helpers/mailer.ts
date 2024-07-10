export async function sendVerificationEmail(to: string, token: string) {
    const subject = "Email Verification";
    // FIXME: fix html and verification link
    const html = `
    <div>
        <h1>Email Verification</h1>
        <p>Click on the link below to verify your email address.</p>
        <a href="${process.env.BASE_URL || "http://localhost:3000"}/auth/verify-mail/${encodeURIComponent(token)}?email=${encodeURIComponent(to)}">Verify Email</a>
    </div>
    `;

    //send email

    console.log("Subject: ", subject);
    console.log("HTML: ", html);

    return { success: true };
}

export async function sendPasswordResetEmail(to: string, token: string) {
    const subject = "Password Reset";
    // FIXME: fix html and verification link
    const html = `
    <div>
        <h1>Password Reset</h1>
        <p>Click on the link below to reset your password.</p>
        <a href="${process.env.BASE_URL || "http://localhost:3000"}/auth/forgotPassword/${encodeURIComponent(token)}?email=${encodeURIComponent(to)}">Reset Password</a>
    </div>
    `;
    // send email

    console.log("Subject: ", subject);
    console.log("HTML: ", html);

    return { success: true };
}

export async function sendNewsLetterEmail(to: string, subject: string, message: string) {
    console.log("sendNewsLetterEmail", to, subject, message);
    // send email
    return { success: true };
}
