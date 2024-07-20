// "use server";

// import { Cat } from "@/models";
// import { revalidateTag } from "next/cache";
// import { redirect } from "next/navigation";
// import { deleteCat, insertCat, updateCat } from "./queries";

// export async function createCat(cat: Omit<Cat, "id">) {
//   if (cat.color === "purple") {
//     return { error: "Bad color!" };
//   }

//   await insertCat(cat);

//   revalidateTag("cats");
//   redirect("/cats");
// }

// export async function editCat(cat: Cat) {
//   if (cat.color === "purple") {
//     return { error: "Bad color!" };
//   }

//   await updateCat(cat);

//   revalidateTag("cats");
//   redirect("/cats/" + cat.id);
// }

// export async function removeCat(id: string) {
//   await deleteCat(id);

//   revalidateTag("cats");
//   redirect("/cats");
// }
