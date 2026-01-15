import mongoose from "mongoose";

const siteConfigSchema = new mongoose.Schema({
    contactNotificationEmails: {
        type: [String],
        default: [],
    },
    orderNotificationEmails: {
        type: [String],
        default: [],
    },
    invoiceCompany: {
        name: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        gstin: { type: String, default: '' },
        addressLine1: { type: String, default: '' },
        addressLine2: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        pincode: { type: String, default: '' },
        country: { type: String, default: '' },
    },
    invoiceTemplateMedia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
        default: null,
    },
    sendContactCopyToUser: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true })

const SiteConfigModel = mongoose.models.SiteConfig || mongoose.model('SiteConfig', siteConfigSchema, 'site_configs')
export default SiteConfigModel
