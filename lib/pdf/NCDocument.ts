import { format } from "date-fns";
import getStream from "get-stream";
import PDFDocument from "pdfkit";

export class NCDocument {
  private mDoc: PDFKit.PDFDocument;
  MARGIN_H = 57;
  MARGIN_V = 60;
  lineColor: string = "#c6c6c6";
  title: string;

  constructor(title: string) {
    this.mDoc = new PDFDocument({
      margins: {
        top: this.MARGIN_V,
        bottom: this.MARGIN_V,
        left: this.MARGIN_H,
        right: this.MARGIN_H,
      },
    });
    this.title = title;
  }

  do(x: (doc: PDFKit.PDFDocument) => void) {
    x(this.mDoc);
    return this;
  }

  doc() {
    return this.mDoc;
  }

  registerFonts() {
    this.mDoc
      .registerFont("Bold", "lib/pdf/fonts/Montserrat-Bold.ttf")
      .registerFont("ExtraBold", "lib/pdf/fonts/Montserrat-ExtraBold.ttf")
      .registerFont("SemiBold", "lib/pdf/fonts/Montserrat-SemiBold.ttf")
      .registerFont("Regular", "lib/pdf/fonts/Montserrat-Regular.ttf")
      .registerFont("Medium", "lib/pdf/fonts/Montserrat-Medium.ttf");
    return this;
  }

  appendPageHeader(rightContent: string) {
    this.mDoc
      .fontSize(30)
      .font("Medium")
      .text("NOIR", { continued: true })
      .font("Bold")
      .text("CAM")
      .moveUp()
      .font("SemiBold")
      .text(rightContent, { align: "right" })
      .fontSize(18)
      .font("Regular")
      .text("S T U D I O", this.mDoc.x + 2, this.mDoc.y - 5)
      .fontSize(11)
      .moveDown(5)
      .text(`Date: ${format(new Date(), "MMM do, yyyy 'at' HH:mm")}`)
      .moveDown(3)
      .font("Bold")
      .fontSize(18)
      .text(this.title);
    return this;
  }

  drawTable(heading: { label: string; w: number }[], rows: string[][]) {
    this.drawTableHeader(heading);

    rows.forEach((row) => {
      this.mDoc.text(row[0], this.MARGIN_H, this.mDoc.y).moveUp();

      for (let i = 1; i < row.length - 1; i++) {
        this.mDoc.text(row[i], this.mDoc.x + heading[i - 1].w + 2).moveUp();
      }

      this.mDoc.text(row[row.length - 1], { align: "right" }).moveDown();
    });
    return this;
  }

  private drawTableHeader(heading: { label: string; w: number }[]) {
    this.mDoc
      .moveDown()
      .font("SemiBold")
      .fontSize(10)
      .fillColor(this.lineColor)
      .text(heading[0].label);

    for (let i = 1; i < heading.length - 1; i++) {
      this.mDoc.moveUp().text(heading[i].label, this.mDoc.x + heading[i - 1].w);
    }

    this.mDoc
      .moveUp()
      .text(heading[heading.length - 1].label, { align: "right" });

    this.drawHr(10);

    this.mDoc.moveDown(2.25).fontSize(12).font("Regular").fillColor("black");

    return this;
  }

  drawHr(gap: number = 10) {
    this.mDoc
      .moveTo(this.MARGIN_H, this.mDoc.y + gap)
      .lineTo(this.mDoc.page.width - this.MARGIN_H, this.mDoc.y + gap)
      .stroke(this.lineColor);
    return this;
  }

  async end() {
    this.mDoc.page.margins.bottom = 0;
    this.mDoc.y = this.mDoc.page.height - this.MARGIN_V;
    this.mDoc
      .fontSize(10)
      .fillColor(this.lineColor)
      .font("Regular")
      .text(`© ${format(new Date(), "yyyy")} — NoirCam Studio`, {
        align: "right",
      })
      .moveUp()
      .text("noircam.studio", this.MARGIN_H, this.mDoc.y, {
        align: "left",
        link: `https://${process.env.VERCEL_URL}`,
      })
      .text("", 50, 50);
    this.mDoc.end();
    return getStream.buffer(this.mDoc);
  }
}
