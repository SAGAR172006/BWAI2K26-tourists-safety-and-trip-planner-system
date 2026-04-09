/**
 * Gmail API client helpers for the Credentials Vault feature.
 * Handles OAuth token exchange and email fetching.
 */

const GMAIL_API_BASE = "https://gmail.googleapis.com/gmail/v1";

export interface GmailThread {
  id: string;
  snippet: string;
  historyId: string;
}

/**
 * Fetches recent booking-related emails from the user's Gmail.
 * This is called server-side via the /api/gmail route.
 */
export async function fetchBookingEmails(accessToken: string) {
  const query = "subject:(booking OR confirmation OR reservation OR ticket)";
  const url = `${GMAIL_API_BASE}/users/me/messages?q=${encodeURIComponent(query)}&maxResults=10`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Gmail API error: ${res.status}`);
  }

  const data = await res.json();
  return data.messages ?? [];
}

/**
 * Gets the full content of a specific Gmail message.
 */
export async function getGmailMessage(accessToken: string, messageId: string) {
  const url = `${GMAIL_API_BASE}/users/me/messages/${messageId}?format=full`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Gmail API error: ${res.status}`);
  }

  return res.json();
}
