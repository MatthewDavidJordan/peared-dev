import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api', // Adjust this path if your API routes are located elsewhere
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Next.js Swagger API Example',
        version: '1.0.0',
      },
    },
  });
  return spec;
};
