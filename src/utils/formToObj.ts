// taken from packages/qwik-city/middleware/request-handler/request-event.ts
export default (formData: FormData): Record<string, any> => {
  /**
   * Convert FormData to object
   * Handle nested form input using dot notation
   * Handle array input using indexed dot notation (name.0, name.0) or bracket notation (name[]),
   * the later is needed for multiselects
   * Create values object by form data entries
   */
  const values = [...formData.entries()].reduce<any>((values, [name, value]) => {
    name.split(".").reduce((object: any, key: string, index: number, keys: any) => {
      // Backet notation for arrays, notibly for multi selects
      if (key.endsWith("[]")) {
        const arrayKey = key.slice(0, -2);
        object[arrayKey] = object[arrayKey] || [];
        return (object[arrayKey] = [...object[arrayKey], value]);
      }

      // If it is not last index, return nested object or array
      if (index < keys.length - 1) {
        return (object[key] = object[key] || (Number.isNaN(+keys[index + 1]) ? {} : []));
      }

      return (object[key] = value);
    }, values);

    // Return modified values
    return values;
  }, {});

  // Return values object
  return values;
};
