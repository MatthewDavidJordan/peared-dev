// src/app/api-docs/page.tsx
import { getApiDocs } from '@/lib/swagger';

export default async function ApiDocsPage() {
  const spec = getApiDocs();
  return <section className="container">{/* <ReactSwagger spec={spec} /> */}</section>;
}
