import { fail, redirect } from '@sveltejs/kit';

interface ReturnObject {
  success: boolean;
  errors:string[];
  name: string,
  passwordConfirmation:string,
  email:string,
  password: string
}

export const actions = {
	default: async ({request, locals:{ supabase}}) => {
		// TODO log the user in
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const passwordConfirmation = formData.get("passwordConfirmation") as string;

    const returnObject: ReturnObject= {
      success: true,
      errors:[],
      name,
      email,
      password,
      passwordConfirmation
    }

    if(name.length < 3) {
      returnObject.errors.push('The name is too short. Must be minimum 3 characters.')
    }

    if(!email.length) {
      returnObject.errors.push('Email ID is required')
    }

    if(!password.length || !passwordConfirmation.length) {
      returnObject.errors.push('Password and Confirm Password are required');
    } else if(password.trim() !== passwordConfirmation.trim()) {

      returnObject.errors.push('Password and Confirm Password should match');
    }

    if(returnObject.errors.length) {
      returnObject.success = false
    }

    const {data, error} = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name
        }
      }
    });

    if(error || !data.user) {
      returnObject.success = false;
      return fail(400, returnObject as any)
    }

    await supabase.from('user_names').insert([{
      user_id: data.user.id,
      name
    }])

    redirect(303, "/private/dashboard")
	}
}