'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import ButtonLoading from '@/components/Application/ButtonLoading'
import MediaModal from '@/components/Application/Admin/MediaModal'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { ADMIN_DASHBOARD, ADMIN_SITE_CONFIGURATION } from '@/routes/AdminPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Image from 'next/image'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_SITE_CONFIGURATION, label: 'Site Configuration' },
]

const SiteConfiguration = () => {
  const [loading, setLoading] = useState(false)
  const [invoiceMediaOpen, setInvoiceMediaOpen] = useState(false)
  const [invoiceSelectedMedia, setInvoiceSelectedMedia] = useState([])

  const formSchema = z.object({
    contactNotificationEmailsText: z.string().optional(),
    orderNotificationEmailsText: z.string().optional(),
    sendContactCopyToUser: z.boolean().optional(),
    invoiceCompanyName: z.string().optional(),
    invoiceCompanyEmail: z.string().optional(),
    invoiceCompanyPhone: z.string().optional(),
    invoiceCompanyGstin: z.string().optional(),
    invoiceCompanyAddressLine1: z.string().optional(),
    invoiceCompanyAddressLine2: z.string().optional(),
    invoiceCompanyCity: z.string().optional(),
    invoiceCompanyState: z.string().optional(),
    invoiceCompanyPincode: z.string().optional(),
    invoiceCompanyCountry: z.string().optional(),
    invoiceTemplateMedia: z.string().nullable().optional(),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactNotificationEmailsText: '',
      orderNotificationEmailsText: '',
      sendContactCopyToUser: false,
      invoiceCompanyName: '',
      invoiceCompanyEmail: '',
      invoiceCompanyPhone: '',
      invoiceCompanyGstin: '',
      invoiceCompanyAddressLine1: '',
      invoiceCompanyAddressLine2: '',
      invoiceCompanyCity: '',
      invoiceCompanyState: '',
      invoiceCompanyPincode: '',
      invoiceCompanyCountry: '',
      invoiceTemplateMedia: null,
    },
  })

  const { data, refetch } = useFetch('/api/site-config')

  useEffect(() => {
    if (data?.success && data.data) {
      const config = data.data
      const emails = (config?.contactNotificationEmails || []).join('\n')
      const orderEmails = (config?.orderNotificationEmails || []).join('\n')
      
      form.reset({
        contactNotificationEmailsText: emails,
        orderNotificationEmailsText: orderEmails,
        sendContactCopyToUser: !!config?.sendContactCopyToUser,
        invoiceCompanyName: config?.invoiceCompany?.name || '',
        invoiceCompanyEmail: config?.invoiceCompany?.email || '',
        invoiceCompanyPhone: config?.invoiceCompany?.phone || '',
        invoiceCompanyGstin: config?.invoiceCompany?.gstin || '',
        invoiceCompanyAddressLine1: config?.invoiceCompany?.addressLine1 || '',
        invoiceCompanyAddressLine2: config?.invoiceCompany?.addressLine2 || '',
        invoiceCompanyCity: config?.invoiceCompany?.city || '',
        invoiceCompanyState: config?.invoiceCompany?.state || '',
        invoiceCompanyPincode: config?.invoiceCompany?.pincode || '',
        invoiceCompanyCountry: config?.invoiceCompany?.country || '',
        invoiceTemplateMedia: config?.invoiceTemplateMedia?._id || null,
      })

      if (config?.invoiceTemplateMedia?._id) {
        setInvoiceSelectedMedia([{ _id: config.invoiceTemplateMedia._id, url: config.invoiceTemplateMedia.secure_url }])
      } else {
        setInvoiceSelectedMedia([])
      }
    }
  }, [data])

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      const emails = (values.contactNotificationEmailsText || '')
        .split(/[\n,]+/)
        .map((e) => e.trim())
        .filter(Boolean)

      const orderEmails = (values.orderNotificationEmailsText || '')
        .split(/[\n,]+/)
        .map((e) => e.trim())
        .filter(Boolean)

      const { data: res } = await axios.put('/api/site-config', {
        contactNotificationEmails: emails,
        orderNotificationEmails: orderEmails,
        invoiceCompany: {
          name: values.invoiceCompanyName || '',
          email: values.invoiceCompanyEmail || '',
          phone: values.invoiceCompanyPhone || '',
          gstin: values.invoiceCompanyGstin || '',
          addressLine1: values.invoiceCompanyAddressLine1 || '',
          addressLine2: values.invoiceCompanyAddressLine2 || '',
          city: values.invoiceCompanyCity || '',
          state: values.invoiceCompanyState || '',
          pincode: values.invoiceCompanyPincode || '',
          country: values.invoiceCompanyCountry || '',
        },
        invoiceTemplateMedia: values.invoiceTemplateMedia || null,
        sendContactCopyToUser: !!values.sendContactCopyToUser,
      })

      if (!res.success) {
        throw new Error(res.message)
      }

      showToast('success', res.message)
      refetch()
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
                  name="orderNotificationEmailsText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Notification Emails</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter email addresses (one per line or comma separated)"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='border-t pt-5'>
                <h4 className='text-lg font-semibold mb-3'>Invoice Settings</h4>

                <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                  <FormField control={form.control} name="invoiceCompanyName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl><Input placeholder="Company name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="invoiceCompanyGstin" render={({ field }) => (
                    <FormItem>
                      <FormLabel>GSTIN</FormLabel>
                      <FormControl><Input placeholder="GSTIN" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="invoiceCompanyEmail" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Email</FormLabel>
                      <FormControl><Input placeholder="Company email" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="invoiceCompanyPhone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Phone</FormLabel>
                      <FormControl><Input placeholder="Company phone" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="invoiceCompanyAddressLine1" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl><Input placeholder="Address line 1" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="invoiceCompanyAddressLine2" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2</FormLabel>
                      <FormControl><Input placeholder="Address line 2" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="invoiceCompanyCity" render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl><Input placeholder="City" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="invoiceCompanyState" render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl><Input placeholder="State" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="invoiceCompanyPincode" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl><Input placeholder="Pincode" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="invoiceCompanyCountry" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl><Input placeholder="Country" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className='mt-5 border border-dashed rounded p-5 text-center'>
                  <MediaModal
                    open={invoiceMediaOpen}
                    setOpen={setInvoiceMediaOpen}
                    selectedMedia={invoiceSelectedMedia}
                    setSelectedMedia={(m) => {
                      setInvoiceSelectedMedia(m)
                      form.setValue('invoiceTemplateMedia', m?.[0]?._id || null)
                    }}
                    isMultiple={false}
                  />

                  {invoiceSelectedMedia.length > 0 && (
                    <div className='flex justify-center items-center flex-wrap mb-3 gap-2'>
                      {invoiceSelectedMedia.map(media => (
                        <div key={media._id} className='h-24 w-24 border'>
                          {/\.pdf(\?|#|$)/i.test(String(media?.url || '')) ? (
                            <a className='w-full h-full flex items-center justify-center text-sm underline' href={media.url} target='_blank' rel='noreferrer'>PDF</a>
                          ) : (
                            <Image src={media.url} height={100} width={100} alt='' className='size-full object-cover' />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div onClick={() => setInvoiceMediaOpen(true)} className='bg-gray-50 dark:bg-card border w-[240px] mx-auto p-5 cursor-pointer'>
                    <span className='font-semibold'>Select Invoice Logo/Template</span>
                  </div>
                </div>
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
