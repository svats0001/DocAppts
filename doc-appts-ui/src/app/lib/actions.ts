'use server';

import {z} from 'zod';
import { cookies } from 'next/headers';

import { Appointment, Practice, Practitioner, specialties } from "@/app/search/search";
import { redirect } from 'next/navigation';
import { sendMail } from './sendMail';
import { billings } from '../register/practice/page';

export type LoginState = {
    errors?: {
      email?: string[];
      password?: string[];
    };
    message?: string | null;
};

export type RegisterState = {
    errors?: {
      email?: string[];
      password?: string[];
      confirmPassword?: string[];
      firstName?: string[];
      lastName?: string[];
      dob?: string[];
      gender?: string[];
      mobile?: string[];
    };
    message?: string | null;
  };

export type PracticeRegisterState = {
    errors: {
        address?: string[];
        description?: string[];
        specialty?: string[];
        name?: string[];
        phone?: string[];
        billing?: string[];
    },
    message?: string | null;
};

export type CardState = {
    errors?: {
        cardNumber?: string[];
    },
    message?: string | null;
}

const formSchema = z.object({
    email: z.string(),
    password: z.string()
});

const formSchemaRegister = z.object({
    email: z.string().email(
        {message: "Please enter a valid email address"}
    ),
    password: z.string().min(8, {message: "Password must be at least 8 characters in length"})
        .max(20, {message: "Password must not exceed 20 characters in length"})
        .refine((value) => /(?=.*[A-Z])/.test(value ?? ""), "Password must contain an uppercase letter")
        .refine((value) => /(?=.*[a-z])/.test(value ?? ""), 'Password must contain a lowercase letter')
        .refine((value) => /(?=.*[0-9])/.test(value ?? ""), "Password must contain a number")
        .refine((value) => /(?=.*[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?])/.test(value ?? ""), 'Password must contain a special character'),
    confirmPassword: z.string(),
    firstName: z.string().min(1, {message: "First name is required"})
        .max(50, {message: "Password must not exceed 50 characters in length"}),
    lastName: z.string().min(1, {message: "Last name is required"})
        .max(50, {message: "Password must not exceed 50 characters in length"}),
    dob: z.coerce.date().min(new Date('1900-01-01'), {message: "Year can't be before 1900"})
        .max(new Date(), {message: "Date of birth can't be today's date or in the future"}),
    gender: z.enum(['Male', 'Female', 'Other'], {message: "Gender must be either Male, Female or Other"}),
    mobile: z.string().refine((value) => /^\d{10}$/.test(value ?? ""), "Enter a valid 10 digit mobile number")
}).refine((data) => {return data.password === data.confirmPassword;}, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
    });

const formSchemaPracticeRegister = z.object({
    address: z.string({required_error: "Address is required"}),
    description: z.string().min(5, {message: "Description must be at least 5 characters in length"})
    .max(200, {message: "Description cannot exceed 200 characters in length"}),
    specialty: z.enum(["General Practitioner", "Iron Infusions", "Gastroenterologist", "Neurologist", "Hematologist", "Endocrinologist"], {message: "Specialty must be from specialties list"}),
    name: z.string().min(5, {message: "Name must be at least 5 characters in length"})
      .max(50, {message: "Name cannot be greater than 50 characters in length"}),
    phone: z.string().refine((value) => /^\d{10}$/.test(value ?? ""), "Enter a valid 10 digit mobile number"),
    billing: z.enum(['Bulk billed', 'Mixed', 'No bulk billing'], {message: "Billing must be from list"})
})

const formSchemaEmailEdit = z.object({
    email: z.string().email(
        {message: "Please enter a valid email address"}
    )
});

const formSchemaPasswordEdit = z.object({
    password: z.string().min(8, {message: "Password must be at least 8 characters in length"})
        .max(20, {message: "Password must not exceed 20 characters in length"})
        .refine((value) => /(?=.*[A-Z])/.test(value ?? ""), "Password must contain an uppercase letter")
        .refine((value) => /(?=.*[a-z])/.test(value ?? ""), 'Password must contain a lowercase letter')
        .refine((value) => /(?=.*[0-9])/.test(value ?? ""), "Password must contain a number")
        .refine((value) => /(?=.*[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?])/.test(value ?? ""), 'Password must contain a special character'),
    confirmPassword: z.string()
}).refine((data) => {return data.password === data.confirmPassword;}, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
    });

const formSchemaFirstNameEdit = z.object({
    firstName: z.string().min(1, {message: "First name is required"})
        .max(50, {message: "Password must not exceed 50 characters in length"})
});

const formSchemaLastNameEdit = z.object({
    lastName: z.string().min(1, {message: "Last name is required"})
        .max(50, {message: "Password must not exceed 50 characters in length"})
});

const formSchemaDobEdit = z.object({
    dob: z.coerce.date().min(new Date('1900-01-01'), {message: "Year can't be before 1900"})
        .max(new Date(), {message: "Date of birth can't be today's date or in the future"})
});

const formSchemaGenderEdit = z.object({
    gender: z.enum(['Male', 'Female', 'Other'], {message: "Gender must be either Male, Female or Other"})
});

const formSchemaMobileEdit = z.object({
    mobile: z.string().refine((value) => /^\d{10}$/.test(value ?? ""), "Enter a valid 10 digit mobile number")
});

const formSchemaCardAdd = z.object({
    cardNumber: z.coerce.number().min(1000000000000000, "Card number must be 16 digits")
    .max(9999999999999999, "Card number must be 16 digits")
})

let pollingFn: NodeJS.Timeout;

export async function handleLogin(prevState: LoginState, fd: FormData): Promise<LoginState> {
    console.log("Inside handle login");
    const validatedFields = formSchema.safeParse({
        email: fd.get('email'),
        password: fd.get('password'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Field errors present"
        }
    } else {
        try {
        const u : User = {email: fd.get('email')?.valueOf().toString(), password: fd.get('password')?.valueOf().toString()};
        console.log("Before login");
        const data = await fetch("https://localhost:7800/login",
            {headers: {
                "X-API-KEY": process.env.X_API_KEY || "",
                "Content-Type": "application/json"
            }, method: "POST", body: JSON.stringify(u)}
        );
        console.log("Completed login fetch");
        const cookieStore = await cookies();
        const sessionId: string = data.headers.get("set-cookie")?.split(";")[0].split("=")[1] || '';
        cookieStore.set("sessionId", sessionId, {secure: true, sameSite: 'strict'});
        const res: User = await data.json();
        cookieStore.set("userId", res.id?.toString() || '', {secure: true, sameSite: 'strict'});
        cookieStore.set("name", res.firstName?.toString() || '', {secure: true, sameSite: 'strict'});
        pollingFn = setInterval(() => pollSession(sessionId), 2*60*1000);
        console.log("Inside login");
        return {
            errors: {},
            message: "Login successful"
        }} catch (exc) {
            /*redirect("/login?submit=True");*/
            return {
                errors: {},
                message: exc instanceof SyntaxError ? "Invalid email and password" : "Server error. Try again later."
            };
        }
    }
}

export async function createPractice(prevState: PracticeRegisterState, fd: FormData): Promise<PracticeRegisterState> {
    const validatedFields = formSchemaPracticeRegister.safeParse({
        address: fd.get('address'),
        description: fd.get('description'),
        specialty: fd.get('specialty'),
        name: fd.get('name'),
        phone: fd.get('phone'),
        billing: fd.get('billing')
    });
    console.log("Inside create practice");
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Field errors present"
        }
    } else {
        if (fd.get('create_practice_button')) {
            try {
            const practice: Practice = {name: fd.get('name')?.valueOf().toString(), address: fd.get('address')?.valueOf().toString().split(" ")[1] + " VIC",
                phone: fd.get('phone')?.valueOf().toString(), description: fd.get('description')?.valueOf().toString(),
                specialty: fd.get('specialty')?.valueOf().toString(), billing: fd.get('billing')?.valueOf().toString()
            }
            const data = await fetch('https://localhost:9090/practices',
                {headers: {
                "X-API-KEY": process.env.X_API_KEY || "",
                "Content-Type": "application/json"
            }, method: "POST", body: JSON.stringify(practice)});
            const createdPractice: Practice = await data.json();
            if (createdPractice.id === undefined || createdPractice.id === 0) {
                throw new Error("Unable to create practice");
            }
            return {
                errors: {},
                message: "Practice successfully created"
            }
            } catch (exc) {
                return {
                    errors: {},
                    message: "Error in creating practice"
                }
            }
        }
        return {
            errors: {},
            message: null
        }
    }
}

export async function pollSession(sessionId: string) {
    try {
    const data = await fetch("https://localhost:7800/"+sessionId,
        {headers: {
            "X-API-KEY": process.env.X_API_KEY || "",
            "Content-Type": "application/json"
        }}
    );
    const res = await data.text();
    return res;
    } catch (err) {
        console.error(err);
    }
}

export async function handleRegister(prevState: RegisterState, fd: FormData): Promise<RegisterState> {
    const validatedFields = formSchemaRegister.safeParse({
        email: fd.get('email'),
        password: fd.get('password'),
        confirmPassword: fd.get('confirm_password'),
        firstName: fd.get('first_name'),
        lastName: fd.get('last_name'),
        dob: fd.get('dob'),
        gender: fd.get('gender'),
        mobile: fd.get('mobile')
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Field errors present"
        }
    } else {
        if (fd.get('register_button')) {
            try {
            const u : User = {email: fd.get('email')?.valueOf().toString(), password: fd.get('password')?.valueOf().toString(),
                firstName: fd.get('first_name')?.valueOf().toString(), lastName: fd.get('last_name')?.valueOf().toString(),
                dob: new Date(fd.get('dob')?.valueOf().toString() || ""), gender: fd.get('gender')?.valueOf().toString(),
                mobile: fd.get('mobile')?.valueOf().toString()
            }
            const data = await fetch("https://localhost:7800/",
                {headers: {
                    "X-API-KEY": process.env.X_API_KEY || "",
                    "Content-Type": "application/json"
                }, method: "POST", body: JSON.stringify(u)}
            );
            const res = await data.text();
            return {
                errors: {},
                message: res
            }} catch (exc) {
                console.log(exc);
            }
        }
        return {
            errors: {},
            message: null
        }
    }
}

export async function handleCardAdd(prevState: CardState, fd: FormData): Promise<CardState> {
    const validatedFields = formSchemaCardAdd.safeParse({
        cardNumber: fd.get('cardNumber')
    });

    console.log("Triggered");
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Field errors present"
        }
    } else {
        console.log(fd);
        if (fd.get('cardAddButton')) {
            console.log("Inside");
            let success = false;
            try {
                const cookieStore = await cookies();
                const sessionId = cookieStore.get('sessionId')?.value;
                const userId = parseInt(cookieStore.get('userId')?.value ?? '');
                const card: Card = {cardNumber: parseInt(fd.get('cardNumber')?.valueOf().toString() ?? ''),
                    userId: userId};
                const data = await fetch("https://localhost:7501/card",
                {headers: {
                    "X-API-KEY": process.env.X_API_KEY || "",
                    "Content-Type": "application/json",
                    "sessionId": sessionId || ""
                }, method: "POST", body: JSON.stringify(card)}
                );
                const res = await data.text();
                success = true;
                return {
                errors: {},
                message: "Card add success---"+res
                }
            } catch (exc) {
                return {
                    errors: {},
                    message: "Card add failed"
                }
            } finally {
                if (success && !fd.get('do_not_redirect_add_card')) {
                    redirect("/user/card");
                }
            }
        }
        return {
            errors: {},
            message: null
        }
    }
}

export async function handleEmailEdit(prevState: RegisterState, fd: FormData): Promise<RegisterState> {
    const validatedFields = formSchemaEmailEdit.safeParse({
        email: fd.get('email')
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Field errors present"
        }
    } else {
        if (fd.get('emailEditButton')) {
            try {
            const cookieStore = await cookies();
            const sessionId = cookieStore.get('sessionId')?.value;
            const userId = parseInt(cookieStore.get('userId')?.value ?? '');
            const u: User = {email: fd.get('email')?.valueOf().toString(), id: userId};
            const data = await fetch("https://localhost:7800/edit/email",
                {headers: {
                    "X-API-KEY": process.env.X_API_KEY || "",
                    "Content-Type": "application/json",
                    "sessionId": sessionId || ""
                }, method: "PUT", body: JSON.stringify(u)}
            );
            const res = await data.text();
            if (res === "Another user with this email already exists") {
                redirect('/user/profile?err=0');
            }
            redirect("/user/profile");
            return {
                errors: {},
                message: res
            }} catch (err) {
                console.error(err);
            }
        }
        return {
            errors: {},
            message: null
        }
    }
}

export async function handleEmailPasswordEdit(prevState: RegisterState, fd: FormData): Promise<RegisterState> {
    const validatedFields = formSchemaEmailEdit.safeParse({
        email: fd.get('email')
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Field errors present"
        }
    } else {
        if (fd.get('emailEditButton')) {
            try {
            const data = await fetch("https://localhost:7800/edit/password/email/"+fd.get('email'),
            {headers: {
                "X-API-KEY": process.env.X_API_KEY || "",
                "Content-Type": "application/json",
            }, method: "POST"}
            );
            const userPasswordReset: PasswordReset = await data.json();
            if (userPasswordReset.urlLink) {
                await sendMail({email: process.env.SMTP_SERVER_USERNAME ?? '',
                    sendTo: fd.get('email')?.valueOf().toString(), subject: 'DocAppts password reset',
                    text: 'Follow this link to reset password: https://localhost:3000/user/profile/password/'+userPasswordReset.urlLink+' . Reset link expires in 60 minutes.'
                });
                redirect('/login/reset/result');
                return {
                errors: {},
                message: "Reset link sent"
                }} else {
                    redirect('/login/reset/result');
                    return {
                    errors: {},
                    message: "Unable to create reset link"
                }}
            } catch (err) {
                console.error(err);
            }
            }
        }
            return {
            errors: {},
            message: ""
        }

}

export async function handlePasswordEdit(prevState: RegisterState, fd: FormData): Promise<RegisterState> {
    const validatedFields = formSchemaPasswordEdit.safeParse({
        password: fd.get('password'),
        confirmPassword: fd.get('confirm_password')
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Field errors present"
        }
    } else {
        if (fd.get('passwordEditButton')) {
            try {
            const cookieStore = await cookies();
            const sessionId = cookieStore.get('sessionId')?.value;
            const userId = parseInt(cookieStore.get('userId')?.value ?? (cookieStore.get('tmpUser')?.value ?? ''));
            const u: User = {password: fd.get('password')?.valueOf().toString(), id: userId};
            const data = await fetch("https://localhost:7800/edit/password",
                {headers: {
                    "X-API-KEY": process.env.X_API_KEY || "",
                    "Content-Type": "application/json",
                    "sessionId": sessionId || ""
                }, method: "PUT", body: JSON.stringify(u)}
            );
            const res = await data.text();
            if (res === "Field updated") {
                cookieStore.delete('tmpUser');
                redirect("/user/profile/password/success");
            } else {
                const urlLink = cookieStore.get('urlLink')?.value;
                cookieStore.delete('urlLink');
                redirect('/user/profile/password/'+urlLink+'?error=True');
            }
            return {
                errors: {},
                message: res
            }
        } catch (err) {
            console.log(err);
        }
        }
        return {
            errors: {},
            message: null
        }
    }
}

export async function handleFirstNameEdit(prevState: RegisterState, fd: FormData): Promise<RegisterState> {
    const validatedFields = formSchemaFirstNameEdit.safeParse({
        firstName: fd.get('first_name')
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Field errors present"
        }
    } else {
        if (fd.get('firstNameEditButton')) {
            let success = false;
            try {
            const cookieStore = await cookies();
            const sessionId = cookieStore.get('sessionId')?.value;
            const userId = parseInt(cookieStore.get('userId')?.value ?? '');
            const u: User = {firstName: fd.get('first_name')?.valueOf().toString(), id: userId};
            const data = await fetch("https://localhost:7800/edit/firstName",
                {headers: {
                    "X-API-KEY": process.env.X_API_KEY || "",
                    "Content-Type": "application/json",
                    "sessionId": sessionId || ""
                }, method: "PUT", body: JSON.stringify(u)}
            );
            const res = await data.text();
            success = true;
            return {
                errors: {},
                message: res
            }} catch (exc) {
                console.log(exc);
            } finally {
                if (success) {
                    console.log('Success');
                    redirect("/user/profile");
                }
            }
        }
        return {
            errors: {},
            message: null
        }
    }
}

export async function handleLastNameEdit(prevState: RegisterState, fd: FormData): Promise<RegisterState> {
    const validatedFields = formSchemaLastNameEdit.safeParse({
        lastName: fd.get('last_name')
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Field errors present"
        }
    } else {
        if (fd.get('lastNameEditButton')) {
            let success = false;
            try { 
            const cookieStore = await cookies();
            const sessionId = cookieStore.get('sessionId')?.value;
            const userId = parseInt(cookieStore.get('userId')?.value ?? '');
            const u: User = {lastName: fd.get('last_name')?.valueOf().toString(), id: userId}
            const data = await fetch("https://localhost:7800/edit/lastName",
                {headers: {
                    "X-API-KEY": process.env.X_API_KEY || "",
                    "Content-Type": "application/json",
                    "sessionId": sessionId || ""
                }, method: "PUT", body: JSON.stringify(u)}
            );
            const res = await data.text();
            success = true;
            return {
                errors: {},
                message: res
            }} catch (exc) {
                console.log(exc);
            } finally {
                if (success) {
                    redirect("/user/profile");
                }
            }
        }
        return {
            errors: {},
            message: null
        }
    }
}

export async function handleDobEdit(prevState: RegisterState, fd: FormData): Promise<RegisterState> {
    const validatedFields = formSchemaDobEdit.safeParse({
        dob: fd.get('dob')
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Field errors present"
        }
    } else {
        if (fd.get('dobEditButton')) {
            let success = false;
            try {
            const cookieStore = await cookies();
            const sessionId = cookieStore.get('sessionId')?.value;
            const userId = parseInt(cookieStore.get('userId')?.value ?? '');
            const u: User = {dob: new Date(fd.get('dob')?.valueOf().toString() || ""), id: userId}
            const data = await fetch("https://localhost:7800/edit/dob",
                {headers: {
                    "X-API-KEY": process.env.X_API_KEY || "",
                    "Content-Type": "application/json",
                    "sessionId": sessionId || ""
                }, method: "PUT", body: JSON.stringify(u)}
            );
            const res = await data.text();
            success = true;
            return {
                errors: {},
                message: res
            }} catch (exc) {
                console.log(exc);
            } finally {
                if (success) {
                    redirect("/user/profile");
                }
            }
        }
        return {
            errors: {},
            message: null
        }
    }
}

export async function handleGenderEdit(prevState: RegisterState, fd: FormData): Promise<RegisterState> {
    const validatedFields = formSchemaGenderEdit.safeParse({
        gender: fd.get('gender')
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Field errors present"
        }
    } else {
        if (fd.get('genderEditButton')) {
            let success = false;
            try {
            const cookieStore = await cookies();
            const sessionId = cookieStore.get('sessionId')?.value;
            const userId = parseInt(cookieStore.get('userId')?.value ?? '');
            const u: User = {gender: fd.get('gender')?.valueOf().toString(), id: userId}
            const data = await fetch("https://localhost:7800/edit/gender",
                {headers: {
                    "X-API-KEY": process.env.X_API_KEY || "",
                    "Content-Type": "application/json",
                    "sessionId": sessionId || ""
                }, method: "PUT", body: JSON.stringify(u)}
            );
            const res = await data.text();
            success = true;
            return {
                errors: {},
                message: res
            }} catch (exc) {
                console.log(exc);
            } finally {
                if (success) {
                    redirect("/user/profile");
                }
            }
        }
        return {
            errors: {},
            message: null
        }
    }
}

export async function handleMobileEdit(prevState: RegisterState, fd: FormData): Promise<RegisterState> {
    const validatedFields = formSchemaMobileEdit.safeParse({
        mobile: fd.get('mobile')
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Field errors present"
        }
    } else {
        if (fd.get('mobileEditButton')) {
            let success = false;
            try {
            const cookieStore = await cookies();
            const sessionId = cookieStore.get('sessionId')?.value;
            const userId = parseInt(cookieStore.get('userId')?.value ?? '');
            const u: User = {mobile: fd.get('mobile')?.valueOf().toString(), id: userId};
            const data = await fetch("https://localhost:7800/edit/mobile",
                {headers: {
                    "X-API-KEY": process.env.X_API_KEY || "",
                    "Content-Type": "application/json",
                    "sessionId": sessionId || ""
                }, method: "PUT", body: JSON.stringify(u)}
            );
            const res = await data.text();
            success = true;
            return {
                errors: {},
                message: res
            }} catch (exc) {
                console.log(exc);
            } finally {
                if (success) {
                    redirect("/user/profile");
                }
            }
        }
        return {
            errors: {},
            message: null
        }
    }
}

export async function getPracticeByNameAndPhone(name: string, phone: string): Promise<Practice> {
    const data = await fetch("https://localhost:9090/practices/"+name+"/"+phone,
        {headers: {
            "X-API-KEY": process.env.X_API_KEY || "",
            "Content-Type": "application/json"
        }}
    );
    const practice: Practice = await data.json();
    return practice;
}

export async function getPractitionerByEmailAndMobile(email: string, mobile: string): Promise<Practitioner> {
    const data = await fetch("https://localhost:8400/practitioners/"+email+"/"+mobile,
        {headers: {
            "X-API-KEY": process.env.X_API_KEY || "",
            "Content-Type": "application/json"
        }}
    );
    const practitioner: Practitioner = await data.json();
    return practitioner;
}

export async function getAppointmentByPracticeIdAndPractitionerId(practiceId: number, practitionerId: number): Promise<Appointment> {
    const data = await fetch("https://localhost:7777/"+practiceId+"/"+practitionerId,
        {headers: {
            "X-API-KEY": process.env.X_API_KEY || "",
            "Content-Type": "application/json"
        }}
    );
    const appointment: Appointment = await data.json();
    return appointment;
}

export async function handleLogout() {
    try {
    if (pollingFn) {
        clearInterval(pollingFn);
    }
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;
    await fetch("https://localhost:7800/logout/"+sessionId,
        {headers: {
            "X-API-KEY": process.env.X_API_KEY || "",
            "Content-Type": "application/json"
        }}
    );
    cookieStore.delete('sessionId');
    cookieStore.delete('userId');
    cookieStore.delete('name');
    } catch (err) {
        console.error(err);
    }
}

export async function bookAppointmentServer(sessionId: string, userId: string, practiceEmail: string, practicePhone: string,
    practitionerId: number | undefined, date: string, startTime: string, card: Card) {
        try {
        if (practitionerId === undefined) {
            return "Unable to book";
        }
        let practice: Practice = {};
        await getPracticeByNameAndPhone(practiceEmail, practicePhone).then((val) => {
            practice = val;
        })
        const bookAppointment = {date: date, userId: userId, startTime: startTime, card: card};
        console.log(bookAppointment);
        const bookedData = await fetch("https://localhost:7777/"+practice.id+"/"+practitionerId,
            {headers: {
                "X-API-KEY": process.env.X_API_KEY || "",
                "Content-Type": "application/json",
                "sessionId": sessionId
            }, method: "POST", body: JSON.stringify(bookAppointment)}
        );
        const bookedStatus = await bookedData.text();
        return bookedStatus;
    } catch (err) {
        console.error(err);
    }
    }

export async function getAllAppointmentsForUser(userId: string): Promise<UserAppointment[]> {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;
    try {const data = await fetch("https://localhost:7777/"+userId,
        {headers: {
            "X-API-KEY": process.env.X_API_KEY || "",
            "Content-Type": "application/json",
            "sessionId": sessionId ?? ''
        }}
    );
    return await data.json();
    } catch (exc) {
        console.log(exc);
        return [];
    }
}

export async function cancelAppointment(bookedAppointmentId: number, appointmentId: number) {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;
    try {const data = await fetch("https://localhost:7777/cancel/"+bookedAppointmentId+"/"+appointmentId,
        {headers: {
            "X-API-KEY": process.env.X_API_KEY || "",
            "Content-Type": "application/json",
            "sessionId": sessionId ?? ""
        }}
    );
    return await data.text();
    } catch (exc) {
        console.log(exc);
        return "Unable to cancel appointment";
    }
}

export async function getUserByUserId(userId: string, sessionId: string) {
    try {
        const data = await fetch("https://localhost:7800/user/"+userId,
        {headers: {
            "X-API-KEY": process.env.X_API_KEY || "",
            "Content-Type": "application/json",
            "sessionId": sessionId
        }});
        return await data.json();
    } catch (exc) {
        console.log(exc);
    }
}

export async function createPasswordResetLink(): Promise<PasswordReset> {
    const cookieStore = await cookies();
    try {
        const userId = cookieStore.get('userId')?.value;
        const data = await fetch("https://localhost:7800/edit/password/"+userId,
            {headers: {
                "X-API-KEY": process.env.X_API_KEY || "",
                "Content-Type": "application/json",
            }, method: "POST"}
        );
        return await data.json();
    } catch (exc) {
        console.log(exc);
        return {};
    }
}

export async function getPasswordResetLink(urlLink: string): Promise<PasswordReset> {
    try {
        const data = await fetch("https://localhost:7800/edit/password/"+urlLink,
            {headers: {
                "X-API-KEY": process.env.X_API_KEY || "",
                "Content-Type": "application/json",
            }}
        );
        const passwordReset: PasswordReset = await data.json();
        return passwordReset;
    } catch (exc) {
        console.log(exc);
        return {};
    }   
}

export async function getPractices(): Promise<Practice[]> {
    try {
        let practices: Practice[] = [];
        console.log("Inside server action get practices");
        const data = await fetch("https://localhost:9090/practices",
            {headers: {
                "X-API-KEY": process.env.X_API_KEY || ""
            }}
        );
        practices = await data.json();
        console.log(practices);
        return practices;
        } catch (err) {
            console.error(err);
            return [];
        }
}

export async function getCard(userId: string, sessionId: string): Promise<Card> {
    try {
        const data = await fetch("https://localhost:7501/card/"+userId,
        {headers: {
            "X-API-KEY": process.env.X_API_KEY || "",
            "Content-Type": "application/json",
            "sessionId": sessionId
        }});
        return await data.json();
    } catch (exc) {
        console.log(exc);
    }
    return {};
    }

export async function deleteCard(id: number | undefined, sessionId: string): Promise<String> {
    try {
        const data = await fetch("https://localhost:7501/card/"+id,
        {headers: {
            "X-API-KEY": process.env.X_API_KEY || "",
            "Content-Type": "application/json",
            "sessionId": sessionId
        }, method: "DELETE"});
        return await data.text();
    } catch (exc) {
        console.log(exc);
        return "";
    }
    }

export async function bookAppointment(practitioner: Practitioner, card: Card, practiceId0: string, practiceId1: string,
    finalDateForServer: string, finalTimeForServer: string) {
        const cookieStore = await cookies();
            const sessionId = cookieStore.get("sessionId");
            if (sessionId) {
                const val = sessionId.value || '';
                if (val !== "") {
                    const userId = cookieStore.get("userId")?.value || '';
                    if (practitioner.id === null) {
                        return;
                    }
                    const bookedStatus = await bookAppointmentServer(val, userId, practiceId0, practiceId1,
                        practitioner.id, finalDateForServer, finalTimeForServer, card);
                    if (bookedStatus === "Successfully booked appointment") {
                        redirect("./booked/success")
                    }
                }
                }
            else {
                redirect("./booked/userError")
            }
            redirect("./booked/systemError");
    }

export interface User {
    id? : number;
    email? : string;
    password? : string;
    firstName?: string;
    lastName?: string;
    dob?: Date;
    gender?: string;
    mobile?: string;
}

export interface UserAppointment {
    bookedAppointmentId: number;
    date: Date;
    startTime: Date;
    endTime: Date;
    practiceName: string;
    practitionerName: string;
    appointmentId: number;
}

export interface PasswordReset {
    urlLink?: string;
    userId?: number;
    created?: Date;
}

export interface Card {
    id?: number;
    cardNumber?: number;
    token?: string;
    userId?: number;
}