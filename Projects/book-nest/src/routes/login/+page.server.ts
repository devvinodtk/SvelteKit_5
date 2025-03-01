import { fail, redirect } from '@sveltejs/kit';

interface ReturnObject {
  success: boolean;
  errors:string[];
  name?: never,
  passwordConfirmation?:never,
  email:string,
  password: string
}

export const actions = {
	default: async ({request, locals:{ supabase}}) => {
		// TODO log the user in
    const formData = await request.formData();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const returnObject: ReturnObject= {
      success: true,
      errors:[],
      email,
      password
    }

    if(!email.length) {
      returnObject.errors.push('Email ID is required')
    }

    if(!password.length) {
      returnObject.errors.push('Password is required');
    }

    if(returnObject.errors.length) {
      returnObject.success = false
    }

    const {data, error} = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if(error) {
      console.log("There has been an error")
      console.log(error)
      returnObject.success = false;
      return fail(400, returnObject as any)
    }

    redirect(303, "/private/dashboard")
	}
}