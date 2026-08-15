import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

export function lexicalToHtml(value: unknown): string {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object') return ''
  try {
    return convertLexicalToHTML({ data: value as never })
  } catch (e) {
    console.error('lexicalToHtml failed:', e)
    return ''
  }
}

export function lexicalToPlaintext(value: unknown): string {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object') return ''
  try {
    return convertLexicalToPlaintext({ data: value as never })
  } catch (e) {
    console.error('lexicalToPlaintext failed:', e)
    return ''
  }
}

export function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}
