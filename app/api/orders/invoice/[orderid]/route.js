import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";
import OrderModel from "@/models/Order.model";
import SiteConfigModel from "@/models/SiteConfig.model";
import { PDFDocument, StandardFonts } from "pdf-lib";

const sanitizePdfText = (value) => {
    return String(value ?? '')
        .replace(/₹/g, 'INR ')
        .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '');
};

const formatMoney = (n) => {
    const num = typeof n === 'number' ? n : Number(n || 0);
    const formatted = num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `INR ${formatted}`;
};

export async function GET(_request, { params }) {
    try {
        await connectDB();
        const orderid = (await params)?.orderid;

        if (!orderid) {
            return new Response('Order not found', { status: 404 });
        }

        const order = await OrderModel.findOne({ order_id: orderid, deletedAt: null }).lean();
        if (!order) {
            return new Response('Order not found', { status: 404 });
        }

        const config = await SiteConfigModel.findOne({}).sort({ createdAt: -1 }).lean();
        const company = config?.invoiceCompany || {};
        const templateMediaId = config?.invoiceTemplateMedia || null;
        const templateMedia = templateMediaId ? await MediaModel.findById(templateMediaId).lean() : null;

        let pdfDoc;
        let page;

        if (templateMedia?.secure_url) {
            try {
                const res = await fetch(templateMedia.secure_url);
                if (res.ok) {
                    const bytes = new Uint8Array(await res.arrayBuffer());
                    const ct = (res.headers.get('content-type') || '').toLowerCase();
                    const isPdf = ct.includes('application/pdf') || templateMedia.secure_url.toLowerCase().includes('.pdf');

                    if (isPdf) {
                        pdfDoc = await PDFDocument.load(bytes);
                        page = pdfDoc.getPages()?.[0] || pdfDoc.addPage([595.28, 841.89]);
                    }
                }
            } catch (e) {
                sanitizePdfText(e?.message);
            }
        }

        if (!pdfDoc) {
            pdfDoc = await PDFDocument.create();
            page = pdfDoc.addPage([595.28, 841.89]);
        }

        if (!page) {
            page = pdfDoc.getPages()?.[0] || pdfDoc.addPage([595.28, 841.89]);
        }

        const { width: PAGE_WIDTH, height: PAGE_HEIGHT } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        let y = PAGE_HEIGHT - 40;
        const left = 50;
        const line = (text, opts = {}) => {
            const size = opts.size || 11;
            const bold = opts.bold || false;
            page.drawText(sanitizePdfText(text), { x: left, y, size, font: bold ? fontBold : font });
            y -= size + (opts.gap ?? 6);
        };

        if (templateMedia?.secure_url && !templateMedia.secure_url.toLowerCase().includes('.pdf')) {
            try {
                const res = await fetch(templateMedia.secure_url);
                if (res.ok) {
                    const bytes = new Uint8Array(await res.arrayBuffer());
                    const ct = (res.headers.get('content-type') || '').toLowerCase();
                    const isPng = ct.includes('png') || templateMedia.secure_url.toLowerCase().includes('.png');
                    const img = isPng ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
                    const maxW = 120;
                    const scale = Math.min(1, maxW / img.width);
                    const w = img.width * scale;
                    const h = img.height * scale;
                    page.drawImage(img, { x: PAGE_WIDTH - 50 - w, y: PAGE_HEIGHT - 40 - h + 8, width: w, height: h });
                }
            } catch (e) {
                sanitizePdfText(e?.message);
            }
        }

        line('INVOICE', { bold: true, size: 18, gap: 10 });
        if (company?.name) {
            line(String(company.name), { bold: true, size: 12, gap: 4 });
        }
        const companyLine1 = [company?.addressLine1, company?.addressLine2].filter(Boolean).join(', ');
        if (companyLine1) {
            line(companyLine1, { size: 10, gap: 2 });
        }
        const companyLine2 = [company?.city, company?.state, company?.pincode].filter(Boolean).join(', ');
        if (companyLine2) {
            line(companyLine2, { size: 10, gap: 2 });
        }
        if (company?.country) {
            line(String(company.country), { size: 10, gap: 2 });
        }
        const companyContact = [company?.phone ? `Phone: ${company.phone}` : null, company?.email ? `Email: ${company.email}` : null].filter(Boolean).join(' | ');
        if (companyContact) {
            line(companyContact, { size: 10, gap: 2 });
        }
        if (company?.gstin) {
            line(`GSTIN: ${company.gstin}`, { size: 10, gap: 2 });
        }
        y -= 8;
        line(`Order ID: ${order.order_id}`, { bold: true });
        line(`Status: ${String(order.status || 'pending')}`);
        y -= 8;

        line('Customer', { bold: true, size: 13, gap: 8 });
        line(`Name: ${order.name}`);
        line(`Email: ${order.email}`);
        line(`Phone: ${order.phone}`);
        y -= 8;

        line('Shipping Address', { bold: true, size: 13, gap: 8 });
        line(`${order.landmark}`);
        line(`${order.city}, ${order.state} - ${order.pincode}`);
        line(`${order.country}`);
        y -= 12;

        line('Items', { bold: true, size: 13, gap: 10 });
        line('Name | Qty | Price | Total', { bold: true, size: 11, gap: 8 });

        const products = Array.isArray(order.products) ? order.products : [];
        for (const p of products) {
            const total = (Number(p.qty) || 0) * (Number(p.sellingPrice) || 0);
            const row = `${p.name} | ${p.qty} | ${formatMoney(p.sellingPrice)} | ${formatMoney(total)}`;
            line(row, { size: 10, gap: 4 });
            if (y < 120) break;
        }

        y -= 12;
        line(`Subtotal: ${formatMoney(order.subtotal)}`);
        line(`Discount: ${formatMoney(order.discount)}`);
        line(`Coupon Discount: ${formatMoney(order.couponDiscountAmount)}`);
        line(`Total: ${formatMoney(order.totalAmount)}`, { bold: true });

        const pdfBytes = await pdfDoc.save();

        return new Response(Buffer.from(pdfBytes), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="invoice-${order.order_id}.pdf"`
            }
        });
    } catch (error) {
        return catchError(error);
    }
}
