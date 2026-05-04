'use strict';

/**
 * Thrown when an inspect-link string cannot be decoded — odd-length hex,
 * non-hex characters, payload too short, or proto bytes that fail to parse.
 *
 * Provides one consistent error type for "this URL is bad", instead of
 * leaking implementation-specific errors (`TypeError`, native proto errors,
 * silently-truncated `Buffer.from(badHex, 'hex')`).
 */
class MalformedInspectLinkError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = 'MalformedInspectLinkError';
  }
}

module.exports = MalformedInspectLinkError;
