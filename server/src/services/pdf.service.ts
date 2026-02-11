import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

const fonts = {
  Roboto: {
    normal: '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    bold: '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    italics: '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    bolditalics: '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
  },
};

export const buildInvoicePdf = (sale: any, businessName: string) => {
  const printer = new PdfPrinter(fonts);
  const doc: TDocumentDefinitions = {
    content: [
      { text: businessName, style: 'header' },
      { text: `Factura: ${sale.invoiceNumber}` },
      { text: `Fecha: ${new Date(sale.createdAt).toLocaleString()}` },
      { text: `Cliente: ${sale.customer?.name || 'Consumidor final'}` },
      { text: ' ' },
      {
        table: {
          widths: ['*', 'auto', 'auto'],
          body: [
            ['Item', 'Precio', 'Total'],
            ...sale.items.map((item: any) => [`${item.product.brand} ${item.product.model}`, item.unitPrice.toFixed(2), item.total.toFixed(2)]),
          ],
        },
      },
      { text: `Subtotal: ${sale.subtotal.toFixed(2)}` },
      { text: `Descuento: ${sale.discount.toFixed(2)}` },
      { text: `Impuesto: ${sale.taxAmount.toFixed(2)}` },
      { text: `TOTAL: ${sale.total.toFixed(2)}`, bold: true },
    ],
    styles: { header: { fontSize: 18, bold: true } },
  };
  return printer.createPdfKitDocument(doc);
};
