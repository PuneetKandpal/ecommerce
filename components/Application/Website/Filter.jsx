'use client'
import useFetch from '@/hooks/useFetch'
import React, { useEffect, useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import ButtonLoading from '../ButtonLoading'
import { useRouter, useSearchParams } from 'next/navigation'
import { WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Filter = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const urlSearchParams = new URLSearchParams(searchParams.toString())

    const [priceFilter, setPriceFilter] = useState({ minPrice: 0, maxPrice: 100000 })
    const [selectedCategory, setSelectedCategory] = useState([])
    const [selectedAttributes, setSelectedAttributes] = useState({})

    const { data: categoryData } = useFetch('/api/category/get-category')
    
    // Fetch attributes based on selected categories
    const attributesUrl = selectedCategory.length > 0 
        ? `/api/product-variant/attributes?category=${selectedCategory.join(',')}` 
        : '/api/product-variant/attributes'
    const { data: attributesData } = useFetch(attributesUrl)

    useEffect(() => {
        // Load category from URL
        if (searchParams.get('category')) {
            setSelectedCategory(searchParams.get('category').split(','))
        } else {
            setSelectedCategory([])
        }

        // Load dynamic attributes from URL (attr_diameter, attr_color, etc.)
        const attrs = {}
        for (const [key, value] of searchParams.entries()) {
            if (key.startsWith('attr_')) {
                const attrKey = key.replace('attr_', '')
                attrs[attrKey] = value.split(',')
            }
        }
        setSelectedAttributes(attrs)
    }, [searchParams])

    const handlePriceChange = (value) => {
        setPriceFilter({ minPrice: value[0], maxPrice: value[1] })
    }

    const handleCategoryFilter = (categorySlug) => {
        let newSelectedCategory = [...selectedCategory]
        if (newSelectedCategory.includes(categorySlug)) {
            newSelectedCategory = newSelectedCategory.filter(cat => cat !== categorySlug)
        } else {
            newSelectedCategory.push(categorySlug)
        }

        setSelectedCategory(newSelectedCategory)

        if (newSelectedCategory.length > 0) {
            urlSearchParams.set('category', newSelectedCategory.join(','))
        } else {
            urlSearchParams.delete('category')
        }

        router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
    }

    const handleAttributeFilter = (attrKey, attrValue) => {
        const newSelectedAttributes = { ...selectedAttributes }
        
        if (!newSelectedAttributes[attrKey]) {
            newSelectedAttributes[attrKey] = []
        }

        if (newSelectedAttributes[attrKey].includes(attrValue)) {
            newSelectedAttributes[attrKey] = newSelectedAttributes[attrKey].filter(v => v !== attrValue)
            if (newSelectedAttributes[attrKey].length === 0) {
                delete newSelectedAttributes[attrKey]
            }
        } else {
            newSelectedAttributes[attrKey].push(attrValue)
        }

        setSelectedAttributes(newSelectedAttributes)

        // Update URL params
        Object.entries(newSelectedAttributes).forEach(([key, values]) => {
            if (values.length > 0) {
                urlSearchParams.set(`attr_${key}`, values.join(','))
            } else {
                urlSearchParams.delete(`attr_${key}`)
            }
        })

        // Clean up removed attributes
        for (const [key, value] of urlSearchParams.entries()) {
            if (key.startsWith('attr_')) {
                const attrKey = key.replace('attr_', '')
                if (!newSelectedAttributes[attrKey]) {
                    urlSearchParams.delete(key)
                }
            }
        }

        router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
    }

    const handlePriceFilter = () => {
        urlSearchParams.set('minPrice', priceFilter.minPrice)
        urlSearchParams.set('maxPrice', priceFilter.maxPrice)
        router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
    }

    return (
        <div>
            {searchParams.size > 0 &&
                <Button type="button" variant="destructive" className="w-full mb-4" asChild>
                    <Link href={WEBSITE_SHOP}>
                        Clear All Filters
                    </Link>
                </Button>
            }
            <Accordion type="multiple" defaultValue={['1', '2']}>
                <AccordionItem value="1">
                    <AccordionTrigger className="uppercase font-semibold hover:no-underline">Category</AccordionTrigger>
                    <AccordionContent>
                        <div className='max-h-48 overflow-auto'>
                            <ul>
                                {categoryData && categoryData.success && categoryData.data.map((category) => (
                                    <li key={category._id} className='mb-3'>
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <Checkbox
                                                onCheckedChange={() => handleCategoryFilter(category.slug)}
                                                checked={selectedCategory.includes(category.slug)}
                                            />
                                            <span>{category.name}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Dynamic Attribute Filters */}
                {attributesData && attributesData.success && attributesData.data.map((attribute, index) => (
                    <AccordionItem key={attribute.key} value={`attr-${index + 2}`}>
                        <AccordionTrigger className="uppercase font-semibold hover:no-underline">
                            {attribute.label}
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className='max-h-48 overflow-auto'>
                                <ul>
                                    {attribute.values.map((value) => (
                                        <li key={value} className='mb-3'>
                                            <label className="flex items-center space-x-3 cursor-pointer">
                                                <Checkbox
                                                    onCheckedChange={() => handleAttributeFilter(attribute.key, value)}
                                                    checked={selectedAttributes[attribute.key]?.includes(value) || false}
                                                />
                                                <span>{value}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}

                <AccordionItem value="price">
                    <AccordionTrigger className="uppercase font-semibold hover:no-underline">Price</AccordionTrigger>
                    <AccordionContent>
                        <Slider 
                            defaultValue={[0, 100000]} 
                            max={100000} 
                            step={1000} 
                            onValueChange={handlePriceChange} 
                        />
                        <div className='flex justify-between items-center pt-2'>
                            <span>{priceFilter.minPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                            <span>{priceFilter.maxPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                        </div>

                        <div className='mt-4'>
                            <ButtonLoading onClick={handlePriceFilter} type="button" text="Apply Price Filter" className="rounded-full" />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default Filter