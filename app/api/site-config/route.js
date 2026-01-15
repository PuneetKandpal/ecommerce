import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import SiteConfigModel from "@/models/SiteConfig.model";
import { z } from "zod";

export async function GET() {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()

        const config = await SiteConfigModel.findOne({}).sort({ createdAt: -1 }).populate('invoiceTemplateMedia').lean()

        return response(true, 200, 'Site config found.', config || null)

    } catch (error) {
        return catchError(error)
    }
}

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()

        const payload = await request.json()

        const schema = z.object({
            contactNotificationEmails: z.array(z.string().email()).optional().default([]),
            orderNotificationEmails: z.array(z.string().email()).optional().default([]),
            invoiceCompany: z.object({
                name: z.string().optional().default(''),
                email: z.string().optional().default(''),
                phone: z.string().optional().default(''),
                gstin: z.string().optional().default(''),
                addressLine1: z.string().optional().default(''),
                addressLine2: z.string().optional().default(''),
                city: z.string().optional().default(''),
                state: z.string().optional().default(''),
                pincode: z.string().optional().default(''),
                country: z.string().optional().default(''),
            }).optional().default({}),
            invoiceTemplateMedia: z.string().nullable().optional().default(null),
            sendContactCopyToUser: z.boolean().optional().default(false),
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing fields.', validate.error)
        }

        const data = validate.data

        const updated = await SiteConfigModel.findOneAndUpdate(
            {},
            {
                $set: {
                    contactNotificationEmails: data.contactNotificationEmails,
                    orderNotificationEmails: data.orderNotificationEmails,
                    invoiceCompany: data.invoiceCompany,
                    invoiceTemplateMedia: data.invoiceTemplateMedia,
                    sendContactCopyToUser: data.sendContactCopyToUser,
                }
            },
            { new: true, upsert: true }
        ).lean()

        return response(true, 200, 'Site config updated.', updated)

    } catch (error) {
        return catchError(error)
    }
}
