import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // Clear the NextAuth cookies by setting them to expire in the past.
    res.setHeader('Set-Cookie', [
        `next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax`,
        `next-auth.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax`
    ]);

    res.status(200).json({ success: true, message: 'Logged out successfully' });
}