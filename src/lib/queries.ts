import { School } from "@/models";
import { getDbClient } from "@/utils/supabase/client";

export async function loadSchools(): Promise<School[]> {
  const client = await getDbClient();
  const { data, error } = await client
    .from('schools')
    .select('*');

  if (error) {
    console.error('Error fetching schools:', error);
    return [];
  }

  return data as School[];
}

// export async function loadCat(id: string) {
//   const query = "SELECT * FROM cats WHERE id = $1 LIMIT 1";
//   const client = await getDbClient();
//   const result = await client.query<Cat>(query, [id]);

//   const cat = result.rows[0];

//   if (!cat) {
//     throw Error("Here kitty kitty! Cannot find cat " + id);
//   }

//   return cat;
// }

// export async function insertCat(cat: Omit<Cat, "id">) {
//   const query =
//     "INSERT INTO cats(id, name, color) VALUES($1, $2, $3) RETURNING *";
//   const client = await getDbClient();
//   const result = await client.query<Cat>(query, [
//     randomUUID(),
//     cat.name,
//     cat.color,
//   ]);

//   return result.rows[0];
// }

// export async function updateCat(cat: Cat) {
//   const query =
//     "UPDATE cats SET name = $1, color = $2, tags = $3 WHERE id = $4 RETURNING *";
//   const client = await getDbClient();
//   const result = await client.query<Cat>(query, [
//     cat.name,
//     cat.color,
//     cat.tags,
//     cat.id,
//   ]);

//   return result.rows[0];
// }

// export async function deleteCat(id: string) {
//   const query = "DELETE FROM cats WHERE id = $1 RETURNING *";
//   const client = await getDbClient();
//   const result = await client.query<Cat>(query, [id]);

//   return result.rows[0];
// }

// export async function loadDogs() {
//   const client = await getDbClient();
//   const result = await client.query<Dog>("SELECT * FROM dogs ORDER BY name");

//   return result.rows;
// }
