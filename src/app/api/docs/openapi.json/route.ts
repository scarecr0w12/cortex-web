import { openapiSpec } from "@/lib/openapi-spec";

export async function GET() {
  return Response.json(openapiSpec, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}
