import supabase, { supabaseUrl } from "./supabase";

export async function getCabins(params) {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function deleteCabin(id) {
  console.log("Deleting cabin with ID:", id); // Log the ID of the cabin being deleted
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath =
    newCabin.image && newCabin.image?.startsWith?.(supabaseUrl);
  const imageName =
    `${Math.random().toString(36).substring(2)}-${newCabin.image.name}`.replace(
      /\//g,
      "-",
    );
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. Create a new cabin in the database
  let query = supabase.from("cabins");

  // A.) If the cabin has an ID, update the existing cabin
  if (id) {
    query = query.update({ ...newCabin, image: imagePath }).eq("id", id);
  }

  // B.) If the cabin does not have an ID, insert a new cabin
  if (!id) {
    console.log("Creating new cabin:", { ...newCabin, image: imagePath }); // Log the new cabin data
    query = query.insert([{ ...newCabin, image: imagePath }]);
  }

  const { data, error } = await query.select();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }

  // 2. Upload the image to Supabase storage
  if (hasImagePath) return data;
  const { error: uploadError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image, {
      cacheControl: "3600",
      upsert: false,
    });

  if (!uploadError) return data;

  // 3. If the image upload fails, delete the cabin from the database
  await supabase.from("cabins").delete().eq("id", data[0].id);
  console.error(uploadError);
  throw new Error("Cabin image could not be uploaded");
}

// export async function editCabin(newCabin) {
//   const imageName =
//     `${Math.random().toString(36).substring(2)}-${newCabin.image.name}`.replace(
//       /\//g,
//       "-",
//     );
//   const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

//   // 1. Create a new cabin in the database
//   const { data, error } = await supabase
//     .from("cabins")
//     .insert([{ ...newCabin, image: imagePath }])
//     .select();

//   if (error) {
//     console.error(error);
//     throw new Error("Cabin could not be created");
//   }

//   // 2. Upload the image to Supabase storage
//   const { error: uploadError } = await supabase.storage
//     .from("cabin-images")
//     .upload(imageName, newCabin.image, {
//       cacheControl: "3600",
//       upsert: false,
//     });

//   if (!uploadError) return data;

//   // 3. If the image upload fails, delete the cabin from the database
//   await supabase.from("cabins").delete().eq("id", data[0].id);
//   console.error(uploadError);
//   throw new Error("Cabin image could not be uploaded");
// }
