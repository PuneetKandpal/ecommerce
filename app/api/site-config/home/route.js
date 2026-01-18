import { response } from '@/lib/helperFunction'
import { setSiteConfigGroup, getSiteConfigGroup } from '@/lib/getSiteConfig'
import { z } from 'zod'

const schema = z.object({
    bannerImages: z.array(z.object({
        id: z.string().optional(),
        url: z.string().url().optional(),
        secure_url: z.string().url().optional(),
        public_id: z.string().optional(),
        alt: z.string().optional(),
        link: z.string().url().optional(),
    })).optional(),
    sliderImages: z.array(z.object({
        id: z.string().optional(),
        url: z.string().url().optional(),
        secure_url: z.string().url().optional(),
        public_id: z.string().optional(),
        alt: z.string().optional(),
        link: z.string().url().optional(),
    })).optional(),
})

export async function GET() {
    try {
        const config = await getSiteConfigGroup('home')
        return response(true, 200, 'Home config fetched successfully.', config)
    } catch (error) {
        console.error('Failed to fetch home config:', error)
        return response(false, 500, 'Failed to fetch home config.')
    }
}

export async function PUT(request) {
    try {
        const body = await request.json()
        const validate = schema.safeParse(body)

        if (!validate.success) {
            return response(false, 400, 'Invalid or missing fields.', validate.error)
        }

        const result = await setSiteConfigGroup('home', validate.data)
        
        if (!result) {
            return response(false, 500, 'Failed to save home config.')
        }

        return response(true, 200, 'Home config saved successfully.', result)
    } catch (error) {
        console.error('Failed to save home config:', error)
        return response(false, 500, 'Failed to save home config.')
    }
}
