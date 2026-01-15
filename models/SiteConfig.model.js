import mongoose from "mongoose";

const siteConfigSchema = new mongoose.Schema({
    contactNotificationEmails: {
        type: [String],
        default: [],
    },
    sendContactCopyToUser: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true })

const SiteConfigModel = mongoose.models.SiteConfig || mongoose.model('SiteConfig', siteConfigSchema, 'site_configs')
export default SiteConfigModel
