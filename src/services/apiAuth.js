import supabase, { supabaseUrl } from "./supabase";

export async function signup({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: "",
      },
    },
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function login({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  console.log(data);
  return data;
}

export async function getCurrentUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

export async function updateUser({ fullName, password }) {
  const {
    data: { user },
    error,
  } = await supabase.auth.updateUser({
    password,
    data: {
      fullName,
    },
  });

  if (error) throw new Error(error.message);
  return user;
}

export async function updateCurrentUser({ fullName, password, avatar }) {
  const { data } = await updateUser({ fullName, password });
  if (!avatar) return data;

  const bucketName = "avatars";
  const imageName =
    `${Math.random().toString(36).substring(2)}-${avatar.name}`.replace(
      /\//g,
      "-",
    );
  const imagePath = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${imageName}`;

  const { error: avatarError } = await supabase.storage
    .from(bucketName)
    .upload(imageName, avatar, {
      cacheControl: 3600,
      upsert: true,
    });

  if (avatarError) throw new Error(avatarError.message);

  const {
    data: { user },
    error: userUpdateError,
  } = await supabase.auth.updateUser({
    data: {
      avatar: imagePath,
    },
  });

  if (userUpdateError) throw new Error(userUpdateError.message);
  return user;
}
