import { handleContact } from '../../contact-core.mjs';

export function onRequest(context) {
  return handleContact(context.request, context.env);
}
