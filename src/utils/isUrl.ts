const emailLintRE = /mailto:([^?\\]+)/;

const localhostDomainRE = /http:\/\/localhost[\d:?]*(?:[^\d:?]\S*)?$/;
const protocolAndDomainRE =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/i;

/**
 * Loosely validate a URL `string`.
 */
export const isUrl = (string: any) => {
  if (typeof string !== "string") {
    return false;
  }

  return (
    emailLintRE.test(string) || localhostDomainRE.test(string) || protocolAndDomainRE.test(string)
  );
};
