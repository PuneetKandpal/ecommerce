import { response } from '@/lib/helperFunction'
import { setSiteConfigGroup, getSiteConfigGroup } from '@/lib/getSiteConfig'
import { z } from 'zod'

const sliderImageObject = z.object({
  id: z.string().optional(),
  url: z.string().optional(),
  secure_url: z.string().optional(),
  public_id: z.string().optional(),
  asset_id: z.string().optional(),
  signature: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
  resource_type: z.string().optional(),
  created_at: z.string().optional(),
  bytes: z.number().optional(),
  type: z.string().optional(),
  etag: z.string().optional(),
  placeholder: z.boolean().optional(),
  alt: z.string().optional(),
  link: z.string().optional(),
})

const schema = z.object({
  sliderImages: z.array(sliderImageObject).optional(),
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
