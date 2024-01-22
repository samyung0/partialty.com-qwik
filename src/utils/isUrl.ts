const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
const emailLintRE = /mailto:([^?\\]+)/;

const localhostDomainRE = /^localhost[\d:?]*(?:[^\d:?]\S*)?$/;
const nonLocalhostDomainRE = /^[^\s.]+\.\S{2,}$/;

/**
 * Loosely validate a URL `string`.
 */
export const isUrl = (string: any) => {
  if (typeof string !== "string") {
    return false;
  }

  const generalMatch = string.match(protocolAndDomainRE);
  const emailLinkMatch = string.match(emailLintRE);

  const match = generalMatch || emailLinkMatch;
  if (!match) {
    return false;
  }

  const everythingAfterProtocol = match[1];
  if (!everythingAfterProtocol) {
    return false;
  }

  try {
    new URL(string);
  } catch {
    return false;
  }

  return (
    localhostDomainRE.test(everythingAfterProtocol) ||
    nonLocalhostDomainRE.test(everythingAfterProtocol)
  );
};
