import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

interface ReturnObject {
  success: boolean;
  email: string;
  password: string;
  passwordConfirmation: string;
  name: string;
  errors: string[];
}

export const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const passwordConfirmation = formData.get("passwordConfirmation") as string;

    const returnObject: ReturnObject = {
      success: true,
      name,
      email,
      password,
      passwordConfirmation,
      errors: [],
    };

    if (name.length < 3) {
      returnObject.errors.push("The name is too short");
    }

    if (password && password.trim() !== passwordConfirmation.trim()) {
      returnObject.errors.push("Password and Confirm Password should match");
    }

    if (returnObject.errors.length) {
      returnObject.success = false;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
        },
      },
    });

    if (error || !data.user) {
      returnObject.success = false;
      if (error?.message) {
        returnObject.errors.push(error?.message);
      }
      return fail(400, returnObject as any);
    }
    const userId = data.user.id;
    const { error: userNameError } = await supabase
      .from("user_names")
      .insert({ user_id: userId, name });

    redirect(303, "/private/dashboard");
  },
} satisfies Actions;
