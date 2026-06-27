export const ApplyCouponSchema = {
  body: {
    type: 'object',
    required: ['counponCode', 'productsList'],
    properties: {
      counponCode: { type: 'string' },
      productsList: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['tittle', 'description', 'price', 'amount'],
          properties: {
            tittle: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            amount: { type: 'integer' },
          },
        },
      },
    },
  },
};
