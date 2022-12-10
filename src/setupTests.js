import { TextDecoder, TextEncoder } from 'util'

/**
 * Fix Jest bug where TextDecoder is missing in JSDOM
 * https://github.com/inrupt/solid-client-authn-js/issues/1676
 */
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
