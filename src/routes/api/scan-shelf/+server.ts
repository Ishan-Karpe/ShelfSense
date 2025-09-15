import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import OpenAI from 'openai';
import { env } from '$env/dynamic/private';

const openai = new OpenAI({
	apiKey: env.OPENAI_API_KEY
});

export const POST: RequestHandler = async ({ request }) => {
	const { base64 } = await request.json();

	const response = await openai.chat.completions.create({
		model: 'gpt-5-mini',
		messages: [
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: `In the given image there will be either one book or mulitple books displayed. Please give me back a JSON and ONLY A JSON SO NOTHING ELSE. 
					Please only give me back a vaild json since this will be handled internally in a program and will crash if any other text comes back with your response. 
					
					What I need as information is the books that you can see in the image in this form:
					{
					"bookTitle": "replace this with title of the book",
					"bookAuthor": "replace this with author of the book"
					}
					
					Example:
					{
					"bookTitle": "Harry Potter and the Deathly Hallows",
					"bookAuthor": "J.K. Rowling"
					}
					
					Please also make sure that you return an array, even if there is one book in the image. Thank you!`
					},
					{
						type: 'image_url',
						image_url: {
							url: `data:image/jpeg;base64,${base64}`,
							detail: 'low'
						}
					}
				]
			}
		]
	});

	console.log(response.choices[0].message.content);

	const bookArrayString = response.choices[0].message.content?.replace(/```json|```/g, '').trim();
	const bookArray = JSON.parse(bookArrayString || '');

	return json({ bookArray });
};
