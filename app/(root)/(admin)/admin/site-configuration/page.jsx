'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { ADMIN_DASHBOARD, ADMIN_SITE_CONFIGURATION } from '@/routes/AdminPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_SITE_CONFIGURATION, label: 'Site Configuration' },
]

const SiteConfiguration = () => {
  const [loading, setLoading] = useState(false)

  const formSchema = z.object({
    contactNotificationEmailsText: z.string().optional(),
    sendContactCopyToUser: z.boolean().optional(),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactNotificationEmailsText: '',
      sendContactCopyToUser: false,
    },
  })

  const { data } = useFetch('/api/site-config')

  useEffect(() => {
    if (data?.success) {
      const config = data.data
      const emails = (config?.contactNotificationEmails || []).join('\n')
      form.setValue('contactNotificationEmailsText', emails)
      form.setValue('sendContactCopyToUser', !!config?.sendContactCopyToUser)
    }
  }, [data])

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      const emails = (values.contactNotificationEmailsText || '')
        .split(/[\n,]+/)
        .map((e) => e.trim())
        .filter(Boolean)

      const { data: res } = await axios.put('/api/site-config', {
        contactNotificationEmails: emails,
        sendContactCopyToUser: !!values.sendContactCopyToUser,
      })

      if (!res.success) {
        throw new Error(res.message)
      }

      showToast('success', res.message)
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <h4 className='text-xl font-semibold'>Site Configuration</h4>
        </CardHeader>
        <CardContent className="pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
              <div>
                <FormField
                  control={form.control}
                  name="contactNotificationEmailsText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Notification Emails</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter email addresses (one per line or comma separated)"
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="sendContactCopyToUser"
                  render={({ field }) => (
                    <FormItem className='flex items-center gap-3 space-y-0'>
                      <FormControl>
                        <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className='m-0'>Send a copy of the contact query to the user</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <ButtonLoading loading={loading} type="submit" text="Save" className="cursor-pointer" />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SiteConfiguration
