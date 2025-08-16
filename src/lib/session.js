"use server";

import { EncryptJWT, jwtDecrypt } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
  return new EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .encrypt(encodedKey);
}

export async function decrypt(session) {
  try {
    const { payload } = await jwtDecrypt(session, encodedKey, {
      clockTolerance: 15,
    });
    return payload;
  } catch (error) {
    console.error("Failed to decrypt session:", error);
    return null;
  }
}

export async function createSession(payload) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ ...payload, expiresAt });

  cookies().set("flodiary-session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  console.log("Flodiary Session Created");
}

export async function getSession() {
  const sessionCookie = await cookies().get("flodiary-session");
  console.log(sessionCookie);

  if (!sessionCookie) {
    return null;
  }

  const session = await decrypt(sessionCookie);

  if (!session) {
    return null;
  }

  if (new Date() > new Date(session.expiresAt)) {
    await deleteSession();
    return null;
  }

  return session;
}

export async function updateSession(newPayload) {
  const session = await getSession();
  if (!session) {
    return;
  }

  const payload = { ...session, ...newPayload };
  await createSession(payload);
}

export async function deleteSession() {
  cookies().delete("flodiary-session");
}
