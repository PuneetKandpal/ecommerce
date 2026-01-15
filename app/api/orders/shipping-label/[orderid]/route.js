import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import OrderModel from "@/models/Order.model";
import { PDFDocument, StandardFonts } from "pdf-lib";

export async function GET(_request, { params }) {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return new Response('Unauthorized', { status: 403 });
        }

        await connectDB();
        const orderid = (await params)?.orderid;

        if (!orderid) {
            return new Response('Order not found', { status: 404 });
        }

        const order = await OrderModel.findOne({ order_id: orderid, deletedAt: null }).lean();
        if (!order) {
            return new Response('Order not found', { status: 404 });
        }

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595.28, 841.89]);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const left = 60;
        let y = 780;
        const line = (text, opts = {}) => {
            const size = opts.size || 14;
            const bold = opts.bold || false;
            page.drawText(String(text), { x: left, y, size, font: bold ? fontBold : font });
            y -= size + (opts.gap ?? 10);
        };

        line('SHIPPING LABEL', { bold: true, size: 20, gap: 16 });
        line(`Order ID: ${order.order_id}`, { bold: true, size: 16, gap: 12 });
        line(`Phone: ${order.phone}`, { size: 14, gap: 12 });

        line('Ship To:', { bold: true, size: 16, gap: 10 });
        line(order.name, { bold: true, size: 16, gap: 10 });
        line(order.landmark, { size: 14, gap: 10 });
        line(`${order.city}, ${order.state} - ${order.pincode}`, { size: 14, gap: 10 });
        line(order.country, { size: 14, gap: 10 });

        const pdfBytes = await pdfDoc.save();

        return new Response(Buffer.from(pdfBytes), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="shipping-label-${order.order_id}.pdf"`
            }
        });
    } catch (error) {
        return catchError(error);
    }
}
