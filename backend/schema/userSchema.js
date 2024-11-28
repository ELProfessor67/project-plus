import { z } from 'zod';


export const RegisterRequestBodySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password length must be 8 or greater'),
    account_name: z.string().min(1, 'Account name is required'),
    bring: z.string().optional(),
    teams_member_count: z.string().optional(),
    focus: z.array(z.string()).min(1, 'At least one item should be provided in the bring array'),
});



export const LoginRequestBodySchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password length must be 8 or greater')
});



export const OTPRequestBodySchema = z.object({
    OTP: z.number().min(6,'OTP lenght shoult be 6')
});


export const ChangePasswordRequestBodySchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(8,"Password length must be 8 or greater."),
});



export const UpdateRequestBodySchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    account_name: z.string().optional(),
    bring: z.string().optional(),
    teams_member_count: z.string().optional(),
    focus: z.array(z.string()).optional(),
});