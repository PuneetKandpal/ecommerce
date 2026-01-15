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

        const config = await SiteConfigModel.findOne({}).sort({ createdAt: -1 }).lean()

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
