export const orderPlacedUserEmail = (data) => {
    const html = `
        <div style="font-family:Arial,sans-serif;line-height:1.5">
            <h2 style="margin:0 0 12px">Order placed successfully</h2>
            <p style="margin:0 0 12px">Your order has been placed successfully and is <b>pending confirmation</b>.</p>
            <p style="margin:0 0 8px"><b>Order ID:</b> ${data.order_id}</p>
            <p style="margin:0 0 8px"><b>Status:</b> ${data.status || 'pending'}</p>
            <p style="margin:0 0 8px"><b>Total:</b> ${Number(data.totalAmount || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
            <p style="margin:16px 0 8px"><a href="${data.orderDetailsUrl}" target="_blank" rel="noreferrer">View order details</a></p>
            <p style="margin:0"><a href="${data.invoiceUrl}" target="_blank" rel="noreferrer">Download invoice (PDF)</a></p>
        </div>
    `;

    return html;
};
