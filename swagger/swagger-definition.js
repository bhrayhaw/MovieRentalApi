const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Movie Rental Api Documentation",
    description: "An Api Documentation for Movie Rentals",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      TokenAuth: {
        type: "apiKey",
        in: "header",
        name: "x-auth-token",
      },
    },
    schemas: {
      Movie: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "Auto-generated ID of the movie",
          },
          title: {
            type: "string",
            description: "Title of the movie",
          },
          genre: {
            type: "object",
            properties: {
              _id: {
                type: "string",
                description: "ID of the genre",
              },
              name: {
                type: "string",
                description: "Name of the genre",
              },
            },
            description: "Genre of the movie",
          },
          rating: {
            type: "number",
            description: "Rating of the movie",
          },
          numberInStock: {
            type: "number",
            description: "Number of copies in stock",
          },
          dailyRentalRate: {
            type: "number",
            description: "Daily rental rate of the movie",
          },
        },
      },
      Genre: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "Auto-generated ID of the genre",
          },
          name: {
            type: "string",
            description: "Name of the genre",
          },
        },
      },
      Customer: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "Auto-generated ID of the customer",
          },
          name: {
            type: "string",
            description: "Name of the customer",
          },
          isGold: {
            type: "boolean",
            description: "Indicates if the customer is a gold member",
          },
          phone: {
            type: "number",
            description: "Phone number of the customer",
          },
        },
      },
      Rental: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "Auto-generated ID of the rental",
          },
          customer: {
            type: "object",
            properties: {
              _id: {
                type: "string",
                description: "ID of the customer",
              },
              name: {
                type: "string",
                description: "Name of the customer",
              },
              isGold: {
                type: "boolean",
                description: "Indicates if the customer is a gold member",
              },
              phone: {
                type: "number",
                description: "Phone number of the customer",
              },
            },
            description: "Customer who rented the movie",
          },
          movie: {
            type: "object",
            properties: {
              _id: {
                type: "string",
                description: "ID of the movie",
              },
              title: {
                type: "string",
                description: "Title of the movie",
              },
              dailyRentalRate: {
                type: "number",
                description: "Daily rental rate of the movie",
              },
            },
            description: "Movie rented",
          },
          dateOut: {
            type: "string",
            format: "date-time",
            description: "Date the rental was taken",
          },
          dateReturned: {
            type: "string",
            format: "date-time",
            description: "Date the rental was returned",
          },
          rentalFee: {
            type: "number",
            description: "Rental fee for the movie",
          },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "Auto-generated ID of the user",
          },
          name: {
            type: "string",
            description: "Name of the user",
          },
          email: {
            type: "string",
            description: "Email of the user",
          },
          password: {
            type: "string",
            description: "Password of the user",
          },
          isAdmin: {
            type: "boolean",
            description: "Indicates if the user is an admin",
          },
        },
      },
    },
  },
  security: [
    {
      TokenAuth: [],
    },
  ],
};

module.exports = swaggerDefinition;
