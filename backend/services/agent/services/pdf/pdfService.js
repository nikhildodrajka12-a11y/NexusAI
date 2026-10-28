import { PDFParse } from "pdf-parse"


export const extractTextFromPdf = async (buffer) => {

    const pdf = new PDFParse({
        data: buffer
    })

    const result = await pdf.getText()

    const text =
        result?.text?.trim() || ""

    return {
        text,
        pageCount:
            result?.total || 0
    }
}