import { put } from '@vercel/blob'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Vercel automatically parses multipart/form-data when bodyParser is disabled
    const chunks: Buffer[] = []
    for await (const chunk of req) {
      chunks.push(Buffer.from(chunk))
    }
    const body = Buffer.concat(chunks)

    // Extract boundary from content-type header
    const contentType = req.headers['content-type'] || ''
    const boundaryMatch = contentType.match(/boundary=(.+)/)
    if (!boundaryMatch) {
      return res.status(400).json({ error: 'Invalid content type' })
    }

    const boundary = boundaryMatch[1]
    const parts = parseMultipart(body, boundary)
    const filePart = parts.find(p => p.name === 'file')

    if (!filePart) {
      return res.status(400).json({ error: 'No file provided' })
    }

    // Sanitize filename and store under projects/
    const originalName = filePart.filename || 'image.jpg'
    const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg'
    const safeName = `projects/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const blob = await put(safeName, filePart.data, {
      access: 'public',
      contentType: filePart.contentType || 'image/jpeg',
    })

    return res.status(200).json({ url: blob.url })
  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({ error: 'Upload failed' })
  }
}

// ── Minimal multipart parser ──────────────────────────────────────────────────
interface MultipartPart {
  name: string
  filename?: string
  contentType: string
  data: Buffer
}

function parseMultipart(body: Buffer, boundary: string): MultipartPart[] {
  const parts: MultipartPart[] = []
  const sep = Buffer.from(`--${boundary}`)
  let start = 0

  while (start < body.length) {
    const sepIdx = body.indexOf(sep, start)
    if (sepIdx === -1) break

    const headerStart = sepIdx + sep.length + 2 // skip \r\n
    const headerEnd = body.indexOf(Buffer.from('\r\n\r\n'), headerStart)
    if (headerEnd === -1) break

    const headers = body.slice(headerStart, headerEnd).toString()
    const dataStart = headerEnd + 4 // skip \r\n\r\n
    const nextSep = body.indexOf(sep, dataStart)
    const dataEnd = nextSep === -1 ? body.length : nextSep - 2 // strip trailing \r\n

    const contentDisposition = headers.match(/Content-Disposition: form-data; name="([^"]+)"(?:; filename="([^"]+)")?/i)
    const contentTypeMatch = headers.match(/Content-Type: (.+)/i)

    if (contentDisposition) {
      parts.push({
        name: contentDisposition[1],
        filename: contentDisposition[2],
        contentType: contentTypeMatch?.[1].trim() || 'application/octet-stream',
        data: body.slice(dataStart, dataEnd),
      })
    }

    start = nextSep === -1 ? body.length : nextSep
  }

  return parts
}

export const config = {
  api: { bodyParser: false },
}
