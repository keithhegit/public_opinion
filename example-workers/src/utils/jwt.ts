/**
 * JWT Token 工具函数
 */

import { SignJWT, jwtVerify } from 'jose';

export async function signJWT(payload: { userId: string; email: string }, secret: string): Promise<string> {
  const secretKey = new TextEncoder().encode(secret);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secretKey);

  return token;
}

export async function verifyJWT(
  token: string,
  secret: string
): Promise<{ userId: string; email: string } | null> {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    return payload as { userId: string; email: string };
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

