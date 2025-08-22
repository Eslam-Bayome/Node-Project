import { ParsedQs } from 'qs';

export const createAdvancedFilter = (
  queryObject: ParsedQs
): { [key: string]: unknown } => {
  const mongoQuery: { [key: string]: any } = {};

  // A map to convert URL query operators to MongoDB operators
  const operatorMap: { [key: string]: string } = {
    gte: '$gte',
    gt: '$gt',
    lte: '$lte',
    lt: '$lt',
  };

  for (const key in queryObject) {
    const value = queryObject[key];

    // Regex to find keys with operators, like "price[gte]"
    const match = key.match(/^(.*?)\[(gte|gt|lte|lt)\]$/);

    if (match) {
      const field = match[1]; // The field name, e.g., 'price'
      const operator = match[2]; // The short operator, e.g., 'gte'
      const mongoOperator = operatorMap[operator]; // The MongoDB operator, e.g., '$gte'

      // If this is the first rule for this field, create the object for it
      if (!mongoQuery[field]) {
        mongoQuery[field] = {};
      }

      // Add the MongoDB operator and value to the field's rules
      mongoQuery[field][mongoOperator] = value;
    } else {
      // For simple keys without operators, just copy them directly
      mongoQuery[key] = value;
    }
  }

  return mongoQuery;
};
