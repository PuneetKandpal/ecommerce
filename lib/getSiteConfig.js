import { connectDB } from "@/lib/databaseConnection";
import MediaModel from "@/models/Media.model";
import SiteConfigGroupModel from "@/models/SiteConfigGroup.model";
import SiteConfigModel from "@/models/SiteConfig.model";

const safeObjectId = (value) => {
    if (!value) return null;
    const s = String(value);
    return s.length === 24 ? s : null;
};

export const SITE_CONFIG_GROUP_KEYS = {
    NOTIFICATIONS: 'notifications',
    INVOICE: 'invoice',
    BANK: 'bank',
    SHIPPING: 'shipping',
    GENERAL: 'general',
};

export const getSiteConfigGroup = async (key) => {
    await connectDB();
    const doc = await SiteConfigGroupModel.findOne({ key }).sort({ updatedAt: -1, createdAt: -1 }).lean();
    return doc?.data || {};
};

export const setSiteConfigGroup = async (key, data) => {
    await connectDB();
    const doc = await SiteConfigGroupModel.findOneAndUpdate(
        { key },
        { $set: { data } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
    return doc?.data || {};
};

export const getMergedSiteConfig = async (opts = {}) => {
    await connectDB();

    const groupDocs = await SiteConfigGroupModel.find({})
        .sort({ updatedAt: -1, createdAt: -1 })
        .lean();

    const groupMap = new Map(groupDocs.map(d => [d.key, d.data || {}]));

    const notifications = groupMap.get(SITE_CONFIG_GROUP_KEYS.NOTIFICATIONS) || {};
    const invoice = groupMap.get(SITE_CONFIG_GROUP_KEYS.INVOICE) || {};
    const bank = groupMap.get(SITE_CONFIG_GROUP_KEYS.BANK) || {};
    const shipping = groupMap.get(SITE_CONFIG_GROUP_KEYS.SHIPPING) || {};
    const general = groupMap.get(SITE_CONFIG_GROUP_KEYS.GENERAL) || {};

    let legacy = null;
    if (!groupDocs.length || opts?.includeLegacyFallback) {
        legacy = await SiteConfigModel.findOne({}).sort({ updatedAt: -1, createdAt: -1 }).lean();
    }

    const merged = {
        contactNotificationEmails: notifications.contactNotificationEmails ?? legacy?.contactNotificationEmails ?? [],
        orderNotificationEmails: notifications.orderNotificationEmails ?? legacy?.orderNotificationEmails ?? [],
        sendContactCopyToUser: general.sendContactCopyToUser ?? legacy?.sendContactCopyToUser ?? false,
        invoiceCompany: invoice.invoiceCompany ?? legacy?.invoiceCompany ?? {},
        invoiceTerms: invoice.invoiceTerms ?? legacy?.invoiceTerms ?? '',
        invoiceFooterNote: invoice.invoiceFooterNote ?? legacy?.invoiceFooterNote ?? '',
        bankDetails: bank.bankDetails ?? legacy?.bankDetails ?? {},
        invoiceTemplateMedia: invoice.invoiceTemplateMedia ?? legacy?.invoiceTemplateMedia ?? null,
        shippingLabelTemplateMedia: shipping.shippingLabelTemplateMedia ?? legacy?.shippingLabelTemplateMedia ?? null,
    };

    if (opts?.populateMedia) {
        const invoiceId = safeObjectId(merged.invoiceTemplateMedia?._id || merged.invoiceTemplateMedia);
        const shippingId = safeObjectId(merged.shippingLabelTemplateMedia?._id || merged.shippingLabelTemplateMedia);

        merged.invoiceTemplateMedia = invoiceId ? await MediaModel.findById(invoiceId).lean() : null;
        merged.shippingLabelTemplateMedia = shippingId ? await MediaModel.findById(shippingId).lean() : null;
    }

    return merged;
};
